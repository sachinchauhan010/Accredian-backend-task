import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const referEarn = async (req, res) => {
	async function sendEmail(referrerName, referrerEmail, referrerPhoneNo, referrerRelation, refertoemail) {
		try {
			const accessToken = await oAuth2Client.getAccessToken();

			const transport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: '010sssachin@gmail.com',
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					refreshToken: process.env.REFRESH_TOKEN,
					accessToken: accessToken.token
				}
			});

			const mailOptions = {
				from: 'Sachin <010sssachin@gmail.com>',
				to: refertoemail,
				subject: 'You Have Been Referred!',
				text: `Hello,

				You have been referred by ${referrerName} (${referrerEmail}, Phone: ${referrerPhoneNo}, Relation: ${referrerRelation}).

				Best regards,
				Sachin`
			};

			const result = await transport.sendMail(mailOptions);
			console.log('Email sent:', result);
			return result;
		} catch (error) {
			console.log('Error sending email:', error.message);
			return error;
		}
	}

	const prisma = new PrismaClient();

	try {
		const { referrerName, referrerEmail, referrerPhoneNo, referrerRelation, refertoemail } = req.body;

		const existingReferrer = await prisma.referrer.findUnique({
			where: { email: referrerEmail }
		});

		if (existingReferrer) {
			const updatedReferrer = await prisma.referrer.update({
				where: { email: referrerEmail },
				data: {
					refertoEmails: {
						push: refertoemail
					}
				}
			});

			sendEmail(referrerName, referrerEmail, referrerPhoneNo, referrerRelation, refertoemail)
				.then(result => console.log('Referral email sent:', result))
				.catch(error => console.log('Error sending referral email:', error.message));

			console.log(updatedReferrer, "updatedReferrer");
			return res.status(200).json(updatedReferrer);
		} else {
			const newReferrer = await prisma.referrer.create({
				data: {
					name: referrerName,
					email: referrerEmail,
					phoneno: referrerPhoneNo,
					relation: referrerRelation,
					refertoEmails: [refertoemail]
				}
			});

			const res=await sendEmail(referrerName, referrerEmail, referrerPhoneNo, referrerRelation, refertoemail)
				.then(result => console.log('Referral email sent:', result))
				.catch(error => console.log('Error sending referral email:', error.message));

			console.log(newReferrer, "newReferrer");
			if(res){

				return res.status(201).json({
					data: newReferrer,
					success: true,
					message: "Refer Email Send"
				});
			}
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'An error occurred while processing your request.' });
	} finally {
		await prisma.$disconnect();
	}
};

import { PrismaClient } from '@prisma/client';

export const referEarn = async (req, res) => {
    const prisma = new PrismaClient();

    try {
        const { referrerName, referrerEmail, referrerPhoneNo, referrerRelation, refertoemail } = req.body;

        // Find if the referrer already exists
        const existingReferrer = await prisma.referrer.findUnique({
            where: { email: referrerEmail }
        });

        if (existingReferrer) {
            // Update the refertoEmails array with the latest email
            const updatedReferrer = await prisma.referrer.update({
                where: { email: referrerEmail },
                data: {
                    referto: {
                        push: refertoemail // Add new email to the array
                    }
                }
            });
            console.log(updatedReferrer, "updatedReferrer");
            return res.status(200).json(updatedReferrer);
        } else {
            // Create a new referrer
            const newReferrer = await prisma.referrer.create({
                data: {
                    name: referrerName,
                    email: referrerEmail,
                    phoneno: referrerPhoneNo,
                    relation: referrerRelation,
                    refertoEmails: [refertoemail] // Initialize the array with the new email
                }
            });
            console.log(newReferrer, "newReferrer");
            return res.status(201).json(newReferrer);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    } finally {
        await prisma.$disconnect();
    }
};

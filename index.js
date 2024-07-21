import express from 'express'
import cors from  'cors'
import { referEarn } from './api/refer.js';
import { config } from 'dotenv';

import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const app= express();

const PORT=process.env.PORT || 3000


app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res)=>{
    res.send("Hey..")
})

app.post('/refer', referEarn)


app.listen(PORT, ()=>{
    console.log(`App is listening on Port number ${PORT}`)
})

const oAuth2Client= new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

async function sendEMail(){

    try {
        const accessToekn= await oAuth2Client.getAccessToken();

        const transport= nodemailer.createTransport({
            service:'gmail',
            auth:{
                type:'OAuth2',
                user:'010sssachin@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToekn.token
            }
        })

        const mailoption ={
            from:'Sachin <010sssachin@gmail.com>',
            to: 'alokverma749@gmail.com',
            subject: 'Hello From Gamil API',
            text:'Hello from Gamil Email API'
        }
        console.log("Hello")
        console.log(await transport.sendMail(mailoption), "%%%%%%%%%%")
        const result=await transport.sendMail(mailoption)
        console.log("ressssssssssssss")
        return result;
        
    } catch (error) {
        return error;
    }

}

sendEMail().then(result=> console.log('Email sent...', result))
.catch(error=> console.log(error.message))

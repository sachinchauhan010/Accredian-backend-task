import express from 'express'
import cors from  'cors'
import { referEarn } from './api/refer.js';
import { config } from 'dotenv';

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
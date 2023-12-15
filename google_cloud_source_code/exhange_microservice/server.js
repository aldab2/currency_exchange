import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import router from './apis/rest.js';



dotenv.config();
connectDB();
const app = express();
const PORT =process.env.PORT || 8080;
//Allows to parse raw json in body
app.use(express.json());
//Allows us to send form data and parse them
app.use(express.urlencoded({extended:true}));
//Allows us to access cookies from requests as req.cookies.<cookeiName>
app.use(cookieParser());







app.use('/',router);

 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




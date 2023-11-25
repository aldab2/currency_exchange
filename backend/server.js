import express from 'express';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import Currency from './models/currencyModel.js';


dotenv.config();
connectDB();
const app = express();
const PORT =process.env.PORT || 5000;
//Allows to parse raw json in body
app.use(express.json());
//Allows us to send form data and parse them
app.use(express.urlencoded({extended:true}));
//Allows us to access cookies from requests as req.cookies.<cookeiName>
app.use(cookieParser());




app.get('/', (req, res) => {
  res.send('API is Running!');
});

 
/**
* 
*  @type {import("express").RequestHandler} */
app.post('/currency',async (req,res)=>{
  const {name,abbreviation,dollarRate } = req.body;

  
  try{

    const currency = await Currency.create(
      {
        name,
        abbreviation,
        dollarRate
      }
    )

    return res.status(201).json(currency)
  }
  catch(error){
    console.log(error)
    return res.status(400).json({message:error.message});
  }
  

})

/**
* 
*  @type {import("express").RequestHandler} */
app.delete('/currency',async (req,res)=>{
  const {name} = req.body;

  
  try{
    if(name){
      const currency = await Currency.findOneAndDelete({name})
      if(currency){
        return res.status(200).json(currency)

      }
      return res.status(404).json({message:`Currency ${name} not found`});
    }
    else {
      return res.status(400).json({message:"Please Insert Currency In Request"})
    }

    
  }
  catch(error){
    console.log(error)
    return res.status(400).json({message:error.message});
  }
  

})

/**
* 
*  @type {import("express").RequestHandler} */
app.get('/currency',async (req,res)=>{  
  try{
    let  {sourceCurrencyName,targetCurrencyName,amount} = req.query;
    if(!amount){
      amount = 1;
    }
    
    const sourceDollarRate = (await Currency.findOne({ name: sourceCurrencyName }, 'dollarRate')).dollarRate
    const targetDollarRate = (await Currency.findOne({ name: targetCurrencyName }, 'dollarRate')).dollarRate
    console.log(sourceDollarRate)
    console.log(targetDollarRate)
  
    const usd = amount / sourceDollarRate ; // Convert AED to USD
    const targetAmount =  usd * targetDollarRate;      // Convert USD to SAR
    return res.status(200).json({
      targetAmount
    })
  }
  catch(error){
    console.log(error)
    return res.status(400).json({message:error.message});
  }
  
})

app.use(notFound);
//app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




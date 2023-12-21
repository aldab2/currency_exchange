import express from 'express';
import Currency from '../models/currencyModel.js';


const router = express.Router();

/**
* 
*  @type {import("express").RequestHandler} */
router.get('/exchange',async (req,res)=>{ 
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  }
  
  
  res.set('Access-Control-Allow-Origin', '*'); 
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
  
});

export default router;
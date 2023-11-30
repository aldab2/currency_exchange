import express from 'express';
import Currency from '../models/currencyModel.js';


const router = express.Router();
/**
* 
*  @type {import("express").RequestHandler} */
router.post('/currency',async (req,res)=>{
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
router.delete('/currency',async (req,res)=>{
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
router.get('/currency',async (req,res)=>{  
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
import express from 'express';
import dotenv from 'dotenv';
//import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { graphqlHTTP } from 'express-graphql';
//import schema from './apis/graphql.js';
//import router from './apis/rest.js';
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLNonNull } from 'graphql';

import mongoose from "mongoose";


const CurrencyType = new GraphQLObjectType({
  name: 'Currency',
  fields: () => ({
    name: { type: GraphQLString },
    abbreviation: { type: GraphQLString },
    dollarRate: { type: GraphQLFloat },
  }),
});
const connectDB = async () =>{
  try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`)

      //TODO Insure Dollar is in DB
  }
  catch (error){
      console.error(`Error: ${error.message}`)
      process.exit(1);
  }

}
dotenv.config();
connectDB();
const app = express();
const PORT =process.env.PORT || 5002;
//Allows to parse raw json in body
app.use(express.json());
//Allows us to send form data and parse them
app.use(express.urlencoded({extended:true}));
//Allows us to access cookies from requests as req.cookies.<cookeiName>
app.use(cookieParser());
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    currencyConversion: {
      type: GraphQLFloat,
      args: {
        sourceCurrencyName: { type: new GraphQLNonNull(GraphQLString) },
        targetCurrencyName: { type: new GraphQLNonNull(GraphQLString) },
        amount: { type: new GraphQLNonNull(GraphQLFloat) },
      },
     async resolve(parent, args) {
        try {
            const sourceCurrency = await Currency.findOne({ name: args.sourceCurrencyName });
            const targetCurrency = await Currency.findOne({ name: args.targetCurrencyName });
      
            if (!sourceCurrency || !targetCurrency) {
              throw new Error('One or more currencies not found');
            }
      
            const usd = args.amount / sourceCurrency.dollarRate;
            const targetAmount = usd * targetCurrency.dollarRate;
      
            return targetAmount;
          } catch (error) {
            throw new Error(error.message);
          }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCurrency: {
      type: CurrencyType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        abbreviation: { type: new GraphQLNonNull(GraphQLString) },
        dollarRate: { type: new GraphQLNonNull(GraphQLFloat) },
      },
      async resolve(parent, args) {
        try {
            const currency = await Currency.create({
              name: args.name,
              abbreviation: args.abbreviation,
              dollarRate: args.dollarRate
            });
      
            return currency;
          } catch (error) {
            throw new Error(error.message);
          }
        },
    },
    deleteCurrency: {
      type: CurrencyType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
            const currency = await Currency.findOneAndDelete({ name: args.name });
            if (!currency) {
              throw new Error(`Currency ${args.name} not found`);
            }
            return currency;
          } catch (error) {
            throw new Error(error.message);
          }
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});



const currencySchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    abbreviation:{
        type: String,
        required: true,
        unique: true
    },
    dollarRate:{
        type: Number,
        required: true
    },
});

const Currency = mongoose.model('Currency',currencySchema);





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


app.get('/', (req, res) => {
  res.send('API is Running!');
});

app.use('/gql', graphqlHTTP({
  schema: schema,
  graphiql: true, // Set to false if you don't want GraphiQL enabled
}));
app.use('/api',router);

 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




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


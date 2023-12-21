const functions = require('@google-cloud/functions-framework');
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLNonNull } = require('graphql');
const mongoose = require("mongoose");


/*
Packages to add in packages.json

{
  "dependencies": {
    "@google-cloud/functions-framework": "^3.0.0",
    "express": "latest",
    "dotenv": "latest",
    "cookie-parser": "latest",
    "express-graphql": "latest",
    "mongoose": "latest",
    "graphql": "latest"
  }
}

*/

const connectDB = async () =>{
  try {
      const conn = await mongoose.connect("mongodb+srv://XXX:XXX@currency.lcwbwcw.mongodb.net/?retryWrites=true&w=majority");
  }
  catch (error){
      console.error(`Error: ${error.message}`)
      process.exit(1);
  }
}

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

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

functions.http('get-all', async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  }
  
  if (req.method === 'GET') {
    res.set('Access-Control-Allow-Origin', '*');
  try{
    const currencies = await Currency.find()
    return res.status(200).json(currencies)
  }
  catch(error){
    console.log(error)
    return res.status(400).json({message:error.message});
  }
  }
});


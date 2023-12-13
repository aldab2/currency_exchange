const functions = require('@google-cloud/functions-framework');
const express = require('express');
const dotenv = require('dotenv');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLNonNull } = require('graphql');
const mongoose = require("mongoose");
const cors = require('cors');

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
    "graphql": "latest",
    "cors": "^2.8.5"
  }
}


*/

// Load environment variables
const connectDB = async () =>{
  try {
      const conn = await mongoose.connect("mongodb+srv://XXX:XXX@currency.lcwbwcw.mongodb.net/?retryWrites=true&w=majority");
      console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`)

      //TODO Insure Dollar is in DB
  }
  catch (error){
      console.error(`Error: ${error.message}`)
      process.exit(1);
  }
}
connectDB();
dotenv.config();

// Initialize express
const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your GraphQL CurrencyType
const CurrencyType = new GraphQLObjectType({
  name: 'Currency',
  fields: () => ({
    name: { type: GraphQLString },
    abbreviation: { type: GraphQLString },
    dollarRate: { type: GraphQLFloat },
  }),
});

// Define MongoDB Schema and Model
const currencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true
  },
  dollarRate: {
    type: Number,
    required: true
  },
});

const Currency = mongoose.model('Currency', currencySchema);

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

// Define GraphQL Schema
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

// Set up GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true, // Set to false in production
}));

// Define Google Cloud Function
exports.graphqlFunction = functions.http('graphql', app);

import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLNonNull } from 'graphql';
import Currency from '../models/currencyModel.js';

const CurrencyType = new GraphQLObjectType({
  name: 'Currency',
  fields: () => ({
    name: { type: GraphQLString },
    abbreviation: { type: GraphQLString },
    dollarRate: { type: GraphQLFloat },
  }),
});

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

export default schema;
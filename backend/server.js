import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { graphqlHTTP } from 'express-graphql';
import schema from './apis/graphql.js';
import router from './apis/rest.js';



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

app.use('/gql', graphqlHTTP({
  schema: schema,
  graphiql: true, // Set to false if you don't want GraphiQL enabled
}));
app.use('/api',router);

 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




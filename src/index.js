// //TODO: get Babel correct for ES
import cors from "cors";
//const cors from "cors";
import express from "express";
//const express from "express";
//import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServer } from "apollo-server-express";

import { makeExecutableSchema } from "graphql-tools";

//const ToolsOfTitansApi from "./datasources/ToolsOfTitansDataSourceApi";
import { typeDefs } from "./graphql-schema";
import resolvers from "./resolvers";

// Create express app
const app = express();

// Add Middleware to our Express server
app.use(cors());

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Create a new apollo server
const server = new ApolloServer({
  schema,
  engine: {
    apiKey: "service:Xavyr-8722:bwDuyeolwk1kyHt37uHXlw"
  },
  introspection: true,
  playground: true
});

// // Applying middleware to the newly created Apollo Server and specify a queriable path (also where Graphiql will display in browser)
server.applyMiddleware({ app, path: "/" });

// // // Open up a port and start the server on it
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live ${PORT}`);
});

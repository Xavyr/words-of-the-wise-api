//TODO: get Babel correct for ES
//import cors from "cors";
const cors = require("cors");
//import express from "express";
const express = require("express");
//import { ApolloServer, gql } from "apollo-server-express";
const { ApolloServer, gql } = require("apollo-server-express");

const { makeExecutableSchema } = require("graphql-tools");

//const ToolsOfTitansApi = require("./datasources/ToolsOfTitansDataSourceApi");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

// Create express app
const app = express();

// Add Middleware to our Express server
app.use(cors());

// const schema = makeExecutableSchema({
//   typeDefs,
//   resolvers
// });

// Create a new apollo server
const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    // const auth = (req.headers && req.headers.authorization) || "";
    // const email = Buffer.from(auth, "base64").toString("ascii");
    // // if the email isn't formatted validly, return null for user
    // if (!isEmail.validate(email)) return { user: null };
    // // find a user by their email
    // const users = await store.users.findOrCreate({ where: { email } });
    // const user = users && users[0] ? users[0] : null;
    // return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  engine: {
    apiKey: "service:Xavyr-8722:bwDuyeolwk1kyHt37uHXlw"
  },
  dataSources: () => ({
    //   toolsOfTitansAPI: new ToolsOfTitansApi({ mockData })
  }),
  introspection: true,
  playground: true
});

// Applying middleware to the newly created Apollo Server and specify a queriable path (also where Graphiql will display in browser)
server.applyMiddleware({ app, path: "/graphql" });

// Open up a port and start the server on it
app.listen({ port: 8000 }, () => {
  console.log(`🚀 Server is live`);
});

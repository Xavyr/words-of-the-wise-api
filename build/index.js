"use strict";

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _graphqlTools = require("graphql-tools");

var _graphqlSchema = require("./graphql-schema");

var _resolvers = _interopRequireDefault(require("./resolvers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// //TODO: get Babel correct for ES
//const cors from "cors";
//const express from "express";
//import { ApolloServer, gql } from "apollo-server-express";
//const ToolsOfTitansApi from "./datasources/ToolsOfTitansDataSourceApi";
// Create express app
const app = (0, _express.default)(); // Add Middleware to our Express server

app.use((0, _cors.default)());
const schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: _graphqlSchema.typeDefs,
  resolvers: _resolvers.default
}); // Create a new apollo server

const server = new _apolloServerExpress.ApolloServer({
  schema,
  engine: {
    apiKey: "service:Xavyr-8722:bwDuyeolwk1kyHt37uHXlw"
  },
  introspection: true,
  playground: true
}); // // Applying middleware to the newly created Apollo Server and specify a queriable path (also where Graphiql will display in browser)

server.applyMiddleware({
  app,
  path: "/"
}); // // // Open up a port and start the server on it

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live ${PORT}`);
});
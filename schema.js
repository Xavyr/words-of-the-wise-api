const { gql } = require("apollo-server");

const typeDefs = gql`
  type Quote {
    _id: String
    titan: String
    hashtags: [String]
    message: String
  }

  input QuoteInput {
    _id: String
    titan: String
    hashtags: [String]
    message: String
  }

  type Titan {
    _id: String
    name: String
    industry: String
    claimToFame: String
    source: String
    quotes: [Quote]
  }

  type Query {
    getTitans: [Titan]
    getQuotes: [Quote]
    getSingleTitanById(id: String!): Titan
    Quote: Quote
  }

  type Mutation {
    login(email: String): String
    saveTitan(
      name: String
      industry: String
      claimToFame: String
      source: String
      quotes: [QuoteInput]
    ): Titan
  }
`;

module.exports = typeDefs;

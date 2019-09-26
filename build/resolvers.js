"use strict";

const {
  paginateResults
} = require("./utils");

const {
  mongoClient
} = require("./utils");

var mongo = require("mongodb");

module.exports = {
  Query: {
    getTitans: async (parent, args, {
      dataSources
    }) => {
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          if (err) return console.log("ERROR: ", err);
          const collection = mongoClient.db("wisdom").collection("titans");
          return collection.find({}).toArray(function (err, results) {
            resolve(results);
          });
        });
        console.log("GOT HERE");
        mongoClient.close();
      });
    },
    getQuotes: async (parent, args, {
      dataSources
    }) => {
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          if (err) return console.log("ERROR: ", err);
          const collection = mongoClient.db("wisdom").collection("quotes");
          return collection.find({}).toArray(function (err, results) {
            resolve(results);
          });
        });
      });
    },
    getSingleTitanById: async (parent, args, {
      dataSources
    }) => {
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          const titanId = args.id;
          var titansObjectId = new mongo.ObjectID(titanId);
          if (err) return console.log("ERROR: ", err);
          const collection = mongoClient.db("wisdom").collection("titans");
          return collection.findOne({
            _id: titansObjectId
          }, function (err, results) {
            resolve(results);
          });
        });
      });
    }
  },
  Titan: {
    quotes: async (parent, args, {
      dataSources
    }) => {
      const titanName = parent.name;
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          if (err) return console.log("ERROR: ", err);
          const collection = mongoClient.db("wisdom").collection("quotes");
          return collection.find({
            titan: titanName
          }).toArray(function (err, results) {
            resolve(results);
          });
        });
      });
    }
  },
  Mutation: {
    saveTitan: async (parent, args, {
      dataSources
    }) => {
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          if (err) return console.log("ERROR: ", err);
          const titanCollection = mongoClient.db("wisdom").collection("titans");
          const quoteDocuments = args.quotes;

          if (quoteDocuments.length === 0) {
            return titanCollection.insertOne(args, function (err, singleTitan) {
              resolve(singleTitan.ops[0]);
            });
          } else {
            const wisdomCollection = mongoClient.db("wisdom").collection("quotes");
            wisdomCollection.insertMany(quoteDocuments, function (err, quotesInserted) {
              const insertedIds = Object.values(quotesInserted.insertedIds);
              args.quotes = insertedIds;
              return titanCollection.insertOne(args, function (err, singleTitan) {
                resolve(singleTitan.ops[0]);
              });
            });
          }
        });
      });
    }
  }
};
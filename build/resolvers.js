"use strict";

const {
  dbCollections
} = require("./utils");

var mongo = require("mongodb");

module.exports = {
  Query: {
    getTitans: async (parent, args, {
      dataSources
    }) => {
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        if (!collections) {
          reject();
        }

        return collections.titans.find({}).toArray(function (err, results) {
          console.log("all titans", results);
          resolve(results);
        });
      });
    },
    getQuotes: async (parent, args, {
      dataSources
    }) => {
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        if (!collections) {
          reject();
        }

        return collections.quotes.find({}).toArray(function (err, results) {
          resolve(results);
        });
      });
    },
    getSingleTitanById: async (parent, args, {
      dataSources
    }) => {
      const titanId = args.id;
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        if (!collections) {
          reject();
        }

        var titansObjectId = new mongo.ObjectID(titanId);
        return collections.titans.findOne({
          _id: titansObjectId
        }, function (err, results) {
          console.log("titan by id", results);
          resolve(results);
        });
      });
    }
  },
  Titan: {
    quotes: async (parent, args, {
      dataSources
    }) => {
      const titanName = parent.name;
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        return collections.quotes.find({
          titan: titanName
        }).toArray(function (err, results) {
          console.log(`titan: ${titanName} quotes`, results);
          resolve(results);
        });
      });
    }
  },
  Mutation: {
    saveTitan: async (parent, args, {
      dataSources
    }) => {
      const quoteDocuments = args.quotes;
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        if (quoteDocuments.length === 0) {
          return collections.titans.insertOne(args, function (err, singleTitan) {
            resolve(singleTitan.ops[0]);
          });
        } else {
          collections.quotes.insertMany(quoteDocuments, function (err, quotesInserted) {
            const insertedIds = Object.values(quotesInserted.insertedIds);
            args.quotes = insertedIds;
            return collections.titans.insertOne(args, function (err, singleTitan) {
              console.log("single saved titan", singleTitan.ops[0]);
              resolve(singleTitan.ops[0]);
            });
          });
        }
      });
    }
  }
};
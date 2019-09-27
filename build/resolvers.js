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

        console.log("SLKDFJLKSDF", collections);
        return collections.quotes.find({}).toArray(function (err, results) {
          console.log("all quotes", results);
          resolve(results);
        });
      });
    } //   getSingleTitanById: async (parent, args, { dataSources }) => {
    //     const titanId = args.id;
    //     const collections = await dbCollections;
    //     return new Promise((resolve, reject) => {
    //       if (!collections) {
    //         reject();
    //       }
    //       var titansObjectId = new mongo.ObjectID(titanId);
    //       console.log("TITAN OBJ", titansObjectId);
    //       return collections.titans.findOne({ _id: titansObjectId }, function(
    //         err,
    //         results
    //       ) {
    //         console.log("titan by id", results);
    //         resolve(results);
    //       });
    //     });
    //   }
    // },

  },
  Titan: {
    quotes: async (parent, args, {
      dataSources
    }) => {
      const titanName = parent.name;
      console.log("PARENT", parent);
      const collections = await dbCollections;
      console.log("COLLECTION", collections);
      console.log(titanName);
      return new Promise((resolve, reject) => {
        return collections.quotes.find({
          titan: titanName
        }).toArray(function (err, results) {
          console.log("titan, ", results);
          resolve(results);
        });
      });
    }
  } // Mutation: {
  //   saveTitan: async (parent, args, { dataSources }) => {
  //     return new Promise((resolve, reject) => {
  //       mongoClient.connect(err => {
  //         if (err) return console.log("ERROR: ", err);
  //         const titanCollection = mongoClient
  //           .db("wisdom")
  //           .collection("titans");
  //         const quoteDocuments = args.quotes;
  //         if (quoteDocuments.length === 0) {
  //           return titanCollection.insertOne(args, function(
  //             err,
  //             singleTitan
  //           ) {
  //             resolve(singleTitan.ops[0]);
  //           });
  //         } else {
  //           const wisdomCollection = mongoClient
  //             .db("wisdom")
  //             .collection("quotes");
  //           wisdomCollection.insertMany(quoteDocuments, function(
  //             err,
  //             quotesInserted
  //           ) {
  //             const insertedIds = Object.values(quotesInserted.insertedIds);
  //             args.quotes = insertedIds;
  //             return titanCollection.insertOne(args, function(
  //               err,
  //               singleTitan
  //             ) {
  //               resolve(singleTitan.ops[0]);
  //             });
  //           });
  //         }
  //       });
  //     });
  //   }
  // }

};
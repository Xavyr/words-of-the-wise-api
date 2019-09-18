const { paginateResults } = require("./utils");
const { mongoClient } = require("./utils");
var mongo = require("mongodb");

module.exports = {
  Query: {
    getTitans: async (parent, args, { dataSources }) => {
      return [
        {
          _id: "5d3dafe61c9d440000651c56",
          name: "BJ Miller",
          industry: "Health and Wellness",
          claimToFame: "Zen Hospice Physician",
          quotes: ["5d3db2661c9d440000651c5b", "5d3dc4121c9d440000651c5f"],
          source: "Tools of the Titans"
        }
      ];
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          if (err) return console.log("ERROR: ", err);
          const collection = mongoClient.db("wisdom").collection("titans");
          return collection.find({}).toArray(function(err, results) {
            resolve(results);
          });
        });
      });
    },
    getQuotes: async (parent, args, { dataSources }) => {
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          if (err) return console.log("ERROR: ", err);
          const collection = mongoClient.db("wisdom").collection("quotes");
          return collection.find({}).toArray(function(err, results) {
            resolve(results);
          });
        });
      });
    },
    getSingleTitanById: async (parent, args, { dataSources }) => {
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          const titanId = args.id;
          var titansObjectId = new mongo.ObjectID(titanId);
          if (err) return console.log("ERROR: ", err);
          const collection = mongoClient.db("wisdom").collection("titans");
          return collection.findOne({ _id: titansObjectId }, function(
            err,
            results
          ) {
            resolve(results);
          });
        });
      });
    }
  },
  Titan: {
    quotes: async (parent, args, { dataSources }) => {
      const titanName = parent.name;
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          if (err) return console.log("ERROR: ", err);
          const collection = mongoClient.db("wisdom").collection("quotes");
          return collection
            .find({ titan: titanName })
            .toArray(function(err, results) {
              resolve(results);
            });
        });
      });
    }
  },
  Mutation: {
    saveTitan: async (parent, args, { dataSources }) => {
      console.log("ARGS", args);
      return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
          if (err) return console.log("ERROR: ", err);
          const titanCollection = mongoClient.db("wisdom").collection("titans");
          const quoteDocuments = args.quotes;
          console.log("HERE", quoteDocuments);
          if (quoteDocuments.length === 0) {
            return titanCollection.insertOne(args, function(err, singleTitan) {
              resolve(singleTitan.ops[0]);
            });
          } else {
            const wisdomCollection = mongoClient
              .db("wisdom")
              .collection("quotes");
            wisdomCollection.insertMany(quoteDocuments, function(
              err,
              quotesInserted
            ) {
              const insertedIds = Object.values(quotesInserted.insertedIds);
              args.quotes = insertedIds;
              return titanCollection.insertOne(args, function(
                err,
                singleTitan
              ) {
                resolve(singleTitan.ops[0]);
              });
            });
          }
        });
      });
    }
  }
};

const { dbCollections } = require("./utils");
var mongo = require("mongodb");

module.exports = {
  Query: {
    getTitans: async (parent, args, { dataSources }) => {
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        if (!collections) {
          reject();
        }
        return collections.titans.find({}).toArray(function(err, results) {
          // console.log("all titans", results);
          resolve(results);
        });
      });
    },
    getQuotes: async (parent, args, { dataSources }) => {
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        if (!collections) {
          reject();
        }
        return collections.quotes.find({}).toArray(function(err, results) {
          resolve(results);
        });
      });
    },
    getPractices: async (parent, args, { dataSources }) => {
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        if (!collections) {
          reject();
        }
        return collections.practices.find({}).toArray(function(err, results) {
          resolve(results);
        });
      });
    },
    getSingleTitanById: async (parent, args, { dataSources }) => {
      const titanId = args.id;
      const collections = await dbCollections;

      return new Promise((resolve, reject) => {
        if (!collections) {
          reject();
        }
        var titansObjectId = new mongo.ObjectID(titanId);
        return collections.titans.findOne({ _id: titansObjectId }, function(
          err,
          results
        ) {
          console.log("titan by id", results);
          resolve(results);
        });
      });
    }
  },
  Titan: {
    quotes: async (parent, args, { dataSources }) => {
      const titanName = parent.name;
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        return collections.quotes
          .find({ titan: titanName })
          .toArray(function(err, results) {
            resolve(results);
          });
      });
    },
    practices: async (parent, args, { dataSources }) => {
      console.log("HIT PRACTICE RESOLVER");
      const titanName = parent.name;
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        return collections.practices
          .find({ titan: titanName })
          .toArray(function(err, results) {
            resolve(results);
          });
      });
    }
  },
  Mutation: {
    saveTitan: async (parent, args, { dataSources }) => {
      const collections = await dbCollections;
      const quoteCollection = collections.quotes;
      const practiceCollection = collections.practices;
      console.log("ARGS", args);
      const { quotes, practices } = args;
      const insertedQuoteIdsPromise = saveQuotes(quotes, quoteCollection);
      const insertedPracticeIdsPromise = savePractices(
        practices,
        practiceCollection
      );
      Promise.all([insertedQuoteIdsPromise, insertedPracticeIdsPromise]).then(
        values => {
          console.log("VALUES FROM PROMISES", values);
          return new Promise((resolve, reject) => {
            args.quotes = values[0] || [];
            args.practices = values[1] || [];
            return collections.titans.insertOne(args, function(
              err,
              singleTitan
            ) {
              console.log("single saved titan", singleTitan.ops[0]);
              resolve(singleTitan.ops[0]);
            });
          });
        }
      );
    },
    deleteAllTitans: async (parent, args, { dataSources }) => {
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        return collections.titans.deleteMany({}, (err, success) => {
          console.log("Deleted All Titans", success.deletedCount);
          resolve(success.deletedCount);
        });
      });
    },
    deleteAllQuotes: async (parent, args, { dataSources }) => {
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        return collections.quotes.deleteMany({}, (err, success) => {
          console.log("Deleted All Quotes", success.deletedCount);
          resolve(success.deletedCount);
        });
      });
    },
    deleteAllPractices: async (parent, args, { dataSources }) => {
      const collections = await dbCollections;
      return new Promise((resolve, reject) => {
        return collections.practices.deleteMany({}, (err, success) => {
          console.log("Deleted All Practices", success.deletedCount);
          resolve(success.deletedCount);
        });
      });
    }
  }
};

const saveQuotes = (quoteDocuments, quoteCollection) => {
  if (quoteDocuments.length === 0) return null;
  return new Promise((resolve, reject) => {
    quoteCollection.insertMany(quoteDocuments, function(err, quotesInserted) {
      const insertedIds = Object.values(quotesInserted.insertedIds);
      return resolve(insertedIds);
    });
  });
};

const savePractices = (practiceDocuments, practiceCollection) => {
  if (practiceDocuments.length === 0) return null;
  return new Promise((resolve, reject) => {
    console.log("CONFIRM", practiceDocuments);
    practiceCollection.insertMany(practiceDocuments, function(
      err,
      practicesInserted
    ) {
      const insertedIds = Object.values(practicesInserted.insertedIds);
      return resolve(insertedIds);
    });
  });
};

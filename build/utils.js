"use strict";

// __  __                           _____        _        _                       _____                            _   _
// |  \/  |                         |  __ \      | |      | |                     / ____|                          | | (_)
// | \  / | ___  _ __   __ _  ___   | |  | | __ _| |_ __ _| |__   __ _ ___  ___  | |     ___  _ __  _ __   ___  ___| |_ _  ___  _ __
// | |\/| |/ _ \| '_ \ / _` |/ _ \  | |  | |/ _` | __/ _` | '_ \ / _` / __|/ _ \ | |    / _ \| '_ \| '_ \ / _ \/ __| __| |/ _ \| '_ \
// | |  | | (_) | | | | (_| | (_) | | |__| | (_| | || (_| | |_) | (_| \__ \  __/ | |___| (_) | | | | | | |  __/ (__| |_| | (_) | | | |
// |_|  |_|\___/|_| |_|\__, |\___/  |_____/ \__,_|\__\__,_|_.__/ \__,_|___/\___|  \_____\___/|_| |_|_| |_|\___|\___|\__|_|\___/|_| |_|
//                      __/ |
//                     |___/
const MongoClient = require("mongodb");

const uri = "mongodb+srv://xavyr:CzCGXW6iWv7XaPq2@cluster0-lbokj.mongodb.net/test?retryWrites=true&w=majority";

const connectDb = async () => {
  const databases = await MongoClient.connect(uri);

  if (!databases) {
    console.log("Database connection erred");
    return null;
  }

  const titans = databases.db("wisdom").collection("titans");
  const quotes = databases.db("wisdom").collection("quotes");
  const practices = databases.db("wisdom").collection("practices");
  const paradigms = databases.db("wisdom").collection("paradigms");
  const inspirationals = databases.db("wisdom").collection("inspirationals");
  const routines = databases.db("wisdom").collection("routines");
  return {
    titans,
    quotes,
    practices,
    paradigms,
    inspirationals,
    routines
  };
};

const collections = connectDb();
module.exports.dbCollections = collections; // __  __            _       _____          _
// |  \/  |          | |     / ____|        | |
// | \  / | ___   ___| | __ | |     ___   __| | ___
// | |\/| |/ _ \ / __| |/ / | |    / _ \ / _` |/ _ \
// | |  | | (_) | (__|   <  | |___| (_) | (_| |  __/
// |_|  |_|\___/ \___|_|\_\  \_____\___/ \__,_|\___|

module.exports.createMockData = () => {
  return {
    titans: [{
      id: 400,
      name: "BJ Miller",
      industry: "Health and Wellness",
      claimToFame: "Zen Hospice Physician"
    }, {
      id: 406,
      name: "Maria Popova",
      industry: "Writer",
      claimToFame: "Written for outlets like NYTimes and Atlantic. Founder of Brain Pickings."
    }],
    quotes: [{
      id: "bj1",
      titanName: "BJ Miller",
      hashtag: "Perspective",
      message: "At the end of life, you can let a lot of the rules that govern our daily lives fly out the window. Because you realize that we’re walking around in systems in society and much of what consumes most of your days in not some natural order. We all navigating some superstructure that we humans created."
    }, {
      id: "bj2",
      titanName: "BJ Miller",
      hashtag: "Advice",
      message: "Let it go. I do mean to take life very seriously, but I need to take things like playfulness and purposelessness very seriously…this is not meant to be light but I think I would have somehow encouraged myself to let go a little bit more and hang in there and not pretend to know where this is all going. You don’t need to know where its all going. "
    }]
  };
}; //Paginate results so that you only load what you are scrolling


module.exports.paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null
}) => {
  if (pageSize < 1) return [];
  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item); // if there's still not a cursor, return false by default

    return itemCursor ? cursor === itemCursor : false;
  });
  return cursorIndex >= 0 ? cursorIndex === results.length - 1 // don't let us overflow
  ? [] : results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + pageSize)) : results.slice(0, pageSize);
  results.slice(cursorIndex >= 0 ? cursorIndex + 1 : 0, cursorIndex >= 0);
};
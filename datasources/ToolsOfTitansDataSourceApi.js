const { DataSource } = require("apollo-datasource");

class ToolsOfTitansApi extends DataSource {
  constructor({ mockData }) {
    super();
    this.store = mockData;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async getAllTitans(totalDataSource) {
    return totalDataSource.titans;
  }

  async getSingleTitanByName(totalDataSource, name) {
    return totalDataSource.titans.filter(titan => titan.name === name)[0];
  }

  async getQuotesByHashtag(totalDataSource, hashtag) {
    return totalDataSource.quotes.filter(quote => quote.hashtag === hashtag);
  }

  async getQuotesByTitan(totalDataSource, titanName) {
    return totalDataSource.quotes.filter(
      quote => quote.titanName === titanName
    );
  }
}

module.exports = ToolsOfTitansApi;

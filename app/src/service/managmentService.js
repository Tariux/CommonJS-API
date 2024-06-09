const { RedisConnection } = require("../../database/redis");

class manageService {
  constructor() {
    this.db = RedisConnection.parent
  }
}

module.exports = { manageService };

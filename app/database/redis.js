
const redis = require("redis");
const defaultConfig = require("../config/default.json");

class RedisManager {
  constructor() {
    (async()=>{
      if (!this.client) {
        await this.initRedis()
  
      }
    })()
  }
  async initRedis() {
    this.client = redis.createClient({
      url: defaultConfig.redis_url,

    });

    this.client.on("error", (err) => console.log(":: + Redis Cluster Error"));
    this.client.on("connect", () => console.log("\x1b[38;5;2m" , `:: + Connected to Redis`));
    
    this.parent =  this.client.duplicate({database:1}).connect()
    this.employe =  this.client.duplicate({database:0}).connect()

  }


}
const Redis = new RedisManager()
module.exports = {Redis};

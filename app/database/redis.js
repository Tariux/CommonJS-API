
const redis = require("redis");
const defaultConfig = require("../config/default.json");

class RedisManager { // ? database class
  constructor() {
    (async()=>{
      if (!this.client) {
        await this.initRedis()
  
      }
    })()
  }
  async initRedis() {
    this.client = redis.createClient({ // ? create a connection from file 'default.json' config file
      url: defaultConfig.redis_url,

    });

    // ? redis events
    this.client.on("error", (err) => console.log(":: + Redis Cluster Error"));
    this.client.on("connect", () => console.log("\x1b[38;5;2m" , `:: + Connected to Redis`));
    
    // ? create two seprate connection for manage better
    this.parent =  (await this.client.duplicate({database:1}).connect())
    this.employe =  (await this.client.duplicate({database:0}).connect())

  }


}
const Redis = new RedisManager()
module.exports = {Redis};

const redis = require("redis");

class RedisConeection {
  constructor() {
    this.client = redis.createClient({
      url: "redis://127.0.0.1:6379",
    });
    this.client.on("error", (err) => console.log(":: + Redis Cluster Error"));
    this.client.on("connect", () => console.log("\x1b[38;5;2m" , `:: + Connected to Redis`));
  }
  selectDatabase(dbIndex) {
    return new Promise((resolve, reject) => {
      this.client.select(dbIndex, (err, res) => {
        if (err) {
          resolve(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  selectParentDB() {
    return this.selectDatabase(1);
  }
  selectEmployeDB() {
    return this.selectDatabase(0);
  }
  async safeQuery(callback) { 
    try {
      return new Promise(async (resolve, reject) => {
        if (typeof callback !== "function") {
          resolve(false);
        } else {
          await this.client.connect();
          const cb = await callback(); 
          await this.client.quit();

          resolve(cb);
        }
      });
    } catch (error) {
      console.log("ERROR IN RUNNING SAFE QUERY: ", error);
      return false;
    }
  }

  employeUniqueID() {
    let id = this.client.incr("employe:id@increment");
    return id;
  }
  parentUniqueID() {
    let id = this.client.incr("parent:id@increment");
    return id;
  }
}

module.exports = { RedisConeection };

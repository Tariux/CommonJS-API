const XCore = require("../core");
const { RedisConeection } = require("../database/redis");

class XRequest {
  isValidRequest() {
    if (!this.request || !this.request.method) {
      return false;
    }
    return true;
  }
  async initDB() {
    this.redis = new RedisConeection();
    this.parentDB = await this.redis.parent();
    this.employeDB = await this.redis.employe();

  }
  parseBody(request) {
    return new Promise((resolve, reject) => {
      let body = "";
      let bodyChunks = [];
      let bodyChunksSize = 0;

      request.on("data", (chunk) => {
        bodyChunks.push(chunk);
        bodyChunksSize += chunk.byteLength;

        if (bodyChunksSize > 10 * 1024 * 1024) {
          console.error("Too large POST request.");
          resolve({});
        }
      });

      request.on("end", () => {
        let mergedBodyChunkBuffer = Buffer.concat(bodyChunks);
        body = mergedBodyChunkBuffer.toString("utf8");
        resolve(JSON.parse(body || '{}'));
      });
    });
  }
}
module.exports = XRequest;

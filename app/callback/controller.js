const { _cr } = require("../helper/client-response");
const { XHelper } = require("../helper/functions");
const { router } = require("../routes/routes");
const url = require("url");

class XController {
  constructor() { // ? will init router in first run
    this.router = router;
  }

  async initContoller(request, response) {


    // ? some fancy stuff 
    console.log('\x1b[36m%s\x1b[0m' , ` :::::: ${request.method} Request!`);
    console.log('\x1b[36m%s\x1b[0m' , ` :: route: ${request.url}`);
    console.log('\x1b[36m%s\x1b[0m' , ` :: ip: (${request.socket.localAddress})`);
    console.log('\x1b[36m%s\x1b[0m' , ` ::`);

    // ? parsing data to this.object
    this.request = request;
    this.response = response;
    this.request.body = await this.parseBody(this.request);

    try {
      this.url = url.parse(this.request.url, true);

      // ? first check is a valid request
      if (this.isValidRequest()) {
        await this.router.route(this.url.pathname, this.request, this.response , this.body); // * route method and pathname to router class
      } else {
        return _cr(response, 500, "درخواست نامعتبر!", false); // ! send error
      }
    } catch (error) { // ! send error
      return _cr(
        response,
        500,
        "خطای ناشناخته در مسیریابی برنامه رخ داد!",
        error
      );
    }
  }
  isValidRequest() { // ? checking by is set method for validate request
    if (!this.request || !this.request.method) {
      return false;
    }
    return true;
  }

  async parseBody(request) { // ? parse chunked body into object
    return new Promise((resolve, reject) => {
      let body = "";
      let bodyChunks = [];

      request.on("data", (chunk) => {
        bodyChunks.push(chunk);
      });

      request.on("end", async () => {

        try {
          let mergedBodyChunkBuffer = Buffer.concat(bodyChunks);
          body = mergedBodyChunkBuffer.toString("utf8");
          if (body.length > 0) {
            this.body = await JSON.parse(body || "{}");
          } else {
            this.body = {};
          }

        } catch (error) {
          resolve(_cr(this.response , 500 , 'ورودی نامعتبر!' , false))
        }
  
        resolve(this.body);
      });
    });
  }
}
module.exports = XController;

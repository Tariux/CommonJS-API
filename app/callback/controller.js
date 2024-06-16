const { _ClientResponse } = require("../helper/ClientResponse");
const { XHelper } = require("../helper/functions");
const { FA } = require("../languages/lang");
const { router } = require("../routes/routes");
const url = require("url");

class XController {
  constructor() {
    // ? will init router in first run
    this.router = router;
  }

  async initContoller(request, response) {
    // ? parsing data to this.object
    this.request = request;
    this.response = response;
    this.request.body = await this.parseBody(this.request);

    try {
      this.url = url.parse(this.request.url, true);
      // ? first check is a valid request
      if (this.isValidRequest()) {
        await this.router.route(
          this.url.pathname,
          this.request,
          this.response,
          this.body
        ); // * route method and pathname to router class
      } else {
        return _ClientResponse(response, FA.INVALID_REQUEST, 400); // ! send error
      }
    } catch (error) {
      // ! send error
      // ? this catch will handle all service and module errors
      console.log(error);
      return _ClientResponse(response, {
        response: error,
        message: FA.UNEXPECTED_ERROR,
      }, 500);
    }
  }

  isValidRequest() {
    // ? checking by is set method for validate request
    if (!this.request || !this.request.method) {
      return false;
    }
    return true;
  }

  async parseBody(request) {
    // ? parse chunked body into object
    return new Promise((resolve) => {
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
          resolve(_ClientResponse(this.response, {
            message: FA.INPUT_ERROR,
            response: error
          }, 400));
        }

        resolve(this.body);
      });
    });
  }
}
module.exports = XController;

const http = require("node:http");
const url = require("url");
const XRouter = require("./callback/router");
const XError = require("./helper/error");
const XResult = require("./helper/error");

class XCore {
  constructor(PORT) {
    this.PORT = PORT;
  }

  init() {
      const server = http.createServer(async (request, response) => {
        this.handleInit(request, response);
      });
      server.listen(this.PORT, () => {
        console.log(`SERVER IS RUNNING | PORT: ${this.PORT}`);
      });

  }
  async handleInit(request, response) {
    try {
      this.request = request;
      this.response = response;
      const Router = new XRouter();
      const urlParse = url.parse(this.request.url, true);
      this.clientPath = urlParse.pathname;
      console.log(`Path ${this.clientPath} Called`);
      Router.route(this.clientPath, this.request, this.response);
  
    } catch (error) {
      new XResult(error.message , this.response , error);

    }
  }
}

module.exports = XCore;

const http = require("node:http");
const defaultConfig = require("./config/default.json");
const XController = require("./callback/controller");
const { _cwelcome } = require("./helper/ClientResponse");
const { FA } = require("./languages/lang");
class XCore {

  constructor() {
    this.PORT = defaultConfig.port; // ? setting default data
  }

  init() {
    try {
      const controller = new XController(); // ? contoller init
      
      const server = http.createServer(async (request, response) => { // ? create server!
        controller.initContoller(request, response); // ? pass the request through the controller
      });

      server.listen(this.PORT, () => { // * show welcome message in console
        _cwelcome()
      });
    } catch (error) {
      console.log('UNEXPECTED_ERROR' , error);
      return {
        error
      }
    }
  }
}

module.exports = XCore;

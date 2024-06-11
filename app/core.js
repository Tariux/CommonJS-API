const http = require("node:http");
const defaultConfig = require("./config/default.json");
const XController = require("./callback/controller");
const { _cwelcome } = require("./helper/client-response");
class XCore {
  constructor() {
    const PORT = defaultConfig.port; // ? setting default data
    this.PORT = PORT;
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
      return _cr( // ! if program crash in starting
        response,
        500,
        "خطای ناشناخته در اجرای برنامه رخ داد!",
        error
      );
    }
  }
}

module.exports = XCore;

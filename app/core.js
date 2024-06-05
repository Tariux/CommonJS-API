const http = require("node:http");
const defaultConfig = require("./config/default.json");
const XController = require("./callback/controller");
const { _cwelcome } = require("./helper/client-response");
class XCore {
  constructor() {
    const PORT = defaultConfig.port;
    this.PORT = PORT;
  }

  init() {
    try {
      const controller = new XController();
      
      const server = http.createServer(async (request, response) => {

        controller.initContoller(request, response);
      });
      server.listen(this.PORT, () => {
        _cwelcome()
      });



    } catch (error) {
      return _cr(
        response,
        error.statusCode || 500,
        "خطای ناشناخته رخ داد!",
        error
      );
    }
  }
}

module.exports = XCore;

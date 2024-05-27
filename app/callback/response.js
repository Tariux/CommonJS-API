const fs = require("fs");
const path = require("path");
const XRequest = require("./request");

class XResponse extends XRequest {
  constructor(request, response) {
    super()
    this.request = request;
    this.response = response;

    this.init();
  }
  async init() {
    this.body = await this.parseBody(this.request);
    switch (this.request.method) {
      case "GET":
        this.calledMethod = "index";
        break;
      case "POST":
        this.calledMethod = "post";
        break;
      case "PUT":
        this.calledMethod = "update";
        break;
      case "DELETE":
        this.calledMethod = "drop";
        break;

      default:
        this.calledMethod = false;
        break;
    }

    try {
      eval(`this.${this.calledMethod}()`);
    } catch (error) {
      console.log("Error in loading method " + this.calledMethod, error);
      XResponse.send404(this.response);
    }
  }
  setHeader(type, status = 200) {
    this.response.writeHead(status, { "Content-Type": type });
  }
  sendRaw(data, status = 200) {
    this.response.writeHead(status, { "Content-Type": "text/plain" });
    this.response.end(data);
  }
  sendJSON(data, status = 200) {
    this.response.writeHead(status, {
      "Content-Type": "application/javascript",
    });
    this.response.end(data);
  }
  sendView(view, ext = "html") {
    try {
      let viewData = fs.readFileSync(
        `${path.dirname(__dirname)}/components/${view}.${ext}`
      );
      this.response.writeHead(200, { "Content-Type": `text/${ext}` });
      this.response.end(viewData);
    } catch (error) {
      XResponse.send404(this.response);
    }
  }

  static send404(response) {
    let P404 = fs.readFileSync(
      `${path.dirname(__dirname)}/components/404.html`
    );
    response.writeHead(404, { "Content-Type": `text/html` });
    response.end(P404);
  }
}

module.exports = XResponse;

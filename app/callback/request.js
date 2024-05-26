const XCore = require("../core");
const XDelete = require("../method/delete");
const XGet = require("../method/get");
const XPost = require("../method/post");
const XPut = require("../method/put");

class XRequest extends XCore {
    constructor(PORT) {
        super(PORT)
    }

  handleRequest() {
    if (!this.request || !this.request.method) {
      return false;
    }
    switch (this.request.method) {
      case "POST":
        new XPost(this.response);
      case "GET":
        new XGet(this.response);
      case "PUT":
        new XPut(this.response);
      case "DELETE":
        new XDelete(this.response);

      default:
        console.log("Access Denied! , method not found.");
        return false;
    }
  }
}

module.exports = XRequest;

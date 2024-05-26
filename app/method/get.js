const XResponse = require("../callback/response");
class XGet extends XResponse {
    constructor(response) {
        super(response)
        this.postData()

    }

    postData() {
        this.sendRaw('MEOW')
    }
}

module.exports = XGet;

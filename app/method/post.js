const XResponse = require("../callback/response");
class XPost extends XResponse {
    constructor(response) {
        super(response)
        this.postData()

    }

    postData() {
        this.sendRaw('MEOW')
    }
}

module.exports = XPost;

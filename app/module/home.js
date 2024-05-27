const XResponse = require("../callback/response");

class HomeModule extends XResponse {
    constructor(request, response) {
        super(request, response)
    }
    index() {
        this.sendView('home');
    }
    post() {
    }
    drop() {

    }
    update() {

    }
    
    
}

module.exports = HomeModule
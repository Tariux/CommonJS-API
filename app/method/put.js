class XPut {
    constructor(request , response) {
        this.redis = new RedisConeection()
        this.request = request
        this.response = response
    }
}

module.exports = XPut;

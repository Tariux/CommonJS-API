class XDelete {
    constructor(request , response) {
        this.redis = new RedisConeection()
        this.request = request
        this.reposnse = response
    }
}

module.exports = XDelete;

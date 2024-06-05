class ModuleInit {
    constructor(req , res) {
        this.request = req
        this.response = res
        this.body = req.body
    
    }
}

module.exports = {ModuleInit};

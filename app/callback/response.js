class XResponse {
    constructor(response) {
        this.response = response;
    }
    setHeader(type , status = 200) {
        this.response.writeHead(status, { 'Content-Type': type });
    }
    sendRaw(data , status = 200) {
        this.response.writeHead(status, { 'Content-Type': 'text/plain' });
        this.response.end(data)
    }
}

module.exports = XResponse;

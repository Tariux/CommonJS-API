class XResult {
  constructor(message, response_obj, error = false , data = null) {
    let response;
    switch (typeof error) {
      case "string":
        response_obj.writeHead(500, {
          "Content-Type": "application/json",
        });
        response_obj.end(
          JSON.stringify({
            error: error,
            
          })
        );

        break;
      case "object":
        response_obj.writeHead(200, {
          "Content-Type": "application/json",
        });

        response = {
          message: `${message}`,
          status: error.statusCode === 200 ? true : false,
          statusCode: error.statusCode,
          data: data
        };
        console.log(error);
        response.error = error.message;
        response_obj.end(JSON.stringify(response));

        break;
      default:
        response_obj.writeHead(200, {
          "Content-Type": "application/json",
        });
        response = {
          response: `${message}`,
          status: error === 200 ? true : false,
          statusCode: error,
          data: data

        };
        response_obj.end(JSON.stringify(response));

        break;
    }
  }
}

module.exports = XResult;

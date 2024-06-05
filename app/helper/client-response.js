var pjson = require('../../package.json');
var cjson = require('../config/default.json');

function _cr(responseObj, statusCode, message, response) {
  let status = false;
  if (statusCode >= 200 && statusCode <= 300) {
    status = true;
  }

  const result = {
    status: status,
    statusCode: statusCode,
    message: message,
    response: response,
  };

  _lr(statusCode , message , response , responseObj)
  responseObj.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  responseObj.end(JSON.stringify(result));


  return response
}



function _lr(statusCode, message, response , responseObj = {}) {
  let status = false;
  if (statusCode >= 200 && statusCode <= 300) {
    status = true;
    color = "\x1b[38;5;10m";
  } else {
    color = "\x1b[38;5;9m"
  }

  const result = {
    status: status,
    statusCode: statusCode,
    message: message,
    response: response,
  };
  console.log(color , `:: Response ${responseObj.req.url} ${responseObj.req.method}!`);
  console.log(color , `:: status: ${JSON.stringify(status)} ${JSON.stringify(statusCode)}!`);
  console.log(color , `:: response-type: ${JSON.stringify(typeof response)}`);
  console.log(color , `:: response-value: ${JSON.stringify(response).substr(0 , 20)}`);
  console.log(color , `::::::`);




  return response
}

function _cwelcome() {

  console.log('\x1b[33m%s\x1b[0m',`
 :: :: :: :: :: :: :: ::
 :: Welcome To System ::
 ::   Version ${pjson.version}   ::
 ::     Port ${cjson.port}     ::
 :: Server is Running ::
 :: :: :: :: :: :: :: ::
  `);
}

module.exports = {_cr , _lr , _cwelcome};

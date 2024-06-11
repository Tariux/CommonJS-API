var pjson = require('../../package.json');
var cjson = require('../config/default.json');

function _cr(responseObj, statusCode, message, response) { // ? client response
  let status = false;
  if (statusCode >= 200 && statusCode <= 300) {
    status = true;
  }
  console.log(typeof response , response);
  if (true) {
    status = false
  }



  const result = {
    status: status,
    statusCode: statusCode,
    message: message,
    ...response,
  };

  _lr(statusCode , message , response , responseObj)
  responseObj.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  responseObj.end(JSON.stringify(result));


  return response
}



function _lr(statusCode, message, response , responseObj = {}) { // ? console response
  let status = false;
  if ((statusCode >= 200 && statusCode <= 300)) {
    status = true;
    color = "\x1b[38;5;10m";
  } else {
    color = "\x1b[38;5;9m"
  }


  console.log(color , `:: Response ${responseObj.req.url} ${responseObj.req.method}!`);
  console.log(color , `:: status: ${JSON.stringify(status)} ${JSON.stringify(statusCode)}!`);
  console.log(color , `:: response-type: ${JSON.stringify(typeof response)}`);
  console.log(color , `:: response-value: ` , response);
  if (response instanceof Error) {
    console.log(color , `:: error-message: ${response.message}`);
    console.log(color , `:: error-name: ${response.name}`);
  }
  console.log(color , `::::::`);



  return response
}

function _cwelcome() { // ? welcome message

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

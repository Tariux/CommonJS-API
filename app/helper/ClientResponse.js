var pjson = require("../../package.json");
var cjson = require("../config/default.json");
var coolors = require('colors/safe');

function _ClientResponse(responseObj, response, statusCode = 200) {
  // ? client response
  let statusBool = true;
  if (statusCode < 200 || statusCode > 300) {
    statusBool = false;
  }
  if (response instanceof Error) {
    statusBool = false;
  }

  statusCode = (response.statusCode) ? response.statusCode : statusCode

  _LogResponse(statusCode, response, responseObj);

  responseObj.writeHead(
    statusCode,
    {
      "Content-Type": "application/json",
    },
    statusCode
  );
  responseObj.end(JSON.stringify(response));

  return response;
}

function _LogResponse(statusCode, response, responseObj = false) {
  // ? console response
  let status = false;
  if (statusCode >= 200 || statusCode <= 300) {
    status = true;
  } 

  if (responseObj) {
    // ? some fancy stuff
    responseConsoles(statusCode, response, responseObj);
  }

  return response;
}

function consolePow(text , color = 'green') {
  console.log(coolors[color](text));
}
function responseConsoles(statusCode, response, responseObj) {

  let colors = ['yellow', 'cyan', 'magenta', 'red', 'green', 'blue' , 'bgWhite' , 'bgGreen' , 'bgYellow' , 'bgRed']
  let random = colors[Math.floor((Math.random()*colors.length))]


  consolePow(` :::::: [${responseObj.req.method} Request] ::::::::::::` , random)
  consolePow(` :: route: ${responseObj.req.url}`, random)
  consolePow(` :: ip: (${responseObj.req.socket.localAddress})`, random)
  consolePow(` :: Response ${responseObj.req.url} ${responseObj.req.method}!`, random)
  consolePow(` :: response-status: ${JSON.stringify(statusCode) || 200}`, random)
  consolePow(` :: response-type: ${JSON.stringify(typeof response)}`, random)
  consolePow(` :: response-length: ${Object.keys(response).length}`, random)
  consolePow(` :: response-value: ${JSON.stringify(response)}` , random)
  consolePow(` :: response-message: ${response.message || ""}`, random)
  if (response instanceof Error) {
    consolePow(`:: error-message: ${response.message}` , 'red')
    consolePow(`:: error-name: ${response.name}`, 'red')
  }
  consolePow(` :::::::::::::::::::::::::::::::::::.` , random)

}

function _cwelcome() {
  // ? welcome message

  consolePow(`
  :: :: :: :: :: :: :: ::
  :: Welcome To System ::
  ::   Version ${pjson.version}   ::
  ::     Port ${cjson.port}     ::
  :: Server is Running ::
  :: :: :: :: :: :: :: ::`)

}

module.exports = { _ClientResponse, _LogResponse, _cwelcome };

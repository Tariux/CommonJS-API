var pjson = require("../../package.json");
var cjson = require("../config/default.json");
var coolors = require("colors/safe");

function _ClientResponse(responseObj, response, statusCode = 200) {
  // ? client response
  let statusBool = true;
  if (statusCode < 200 || statusCode > 300) {
    statusBool = false;
  }
  if (response instanceof Error) {
    statusBool = false;
  }

  statusCode = response.statusCode ? response.statusCode : statusCode;

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

function consolePow(text, color = "green") {
  console.log(coolors[color](text));
}
function responseConsoles(statusCode, response, responseObj) {
  let error_title = `${JSON.stringify(statusCode) || 200} ${responseObj.req.method || "UNKNOWN"} ${
    responseObj.req.url
  } from ${responseObj.req.socket.localAddress} length(${
    Object.keys(response).length
  }) type(${JSON.stringify(typeof response)})`;
  Logger.ok(error_title, response.message || JSON.stringify(response));
  console.log('⏑ ⏑ ⏑ ⏑ ⏑ ⏑ ⏑ ⏑ ⏑ ⏑ ⏑ ⏑ ');
}

function _cwelcome() {
  // ? welcome message

  consolePow(`
  :: :: :: :: :: :: :: ::
  :: Welcome To System ::
  ::   Version ${pjson.version}   ::
  ::     Port ${cjson.port}     ::
  :: Server is Running ::
  :: :: :: :: :: :: :: ::`);
}

module.exports = { _ClientResponse, _LogResponse, _cwelcome };

class Logger {
  /**
   * Parses the log entry and adds it to the logs
   * @param {string} type - The type of log (e.g., SUCCESS, ERROR)
   * @param {string} title - The title of the log entry
   * @param {string} description - The description of the log entry
   */
  static parseLogEntry(type, title, description) {
    const logEntry = {
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
    };

    console.log(
      `${logEntry.type} ${logEntry.title} ${logEntry.description}`,
      `[${new Date(logEntry.timestamp).toLocaleString()}]`
    );
  }

  /**
   * Logs a success message
   * @param {string} title - The title of the log entry
   * @param {string} description - The description of the log entry
   */
  static ok(title, data = "EMPTY", description = "") {
    const eid = Math.round(Math.random() * 10000);

    Logger.parseLogEntry(
      ` ▣ 🚀 ↪  (SERVICE) OK! [${eid}] ⇨ `,
      title,
      description
    );
    if (typeof data === "object") {
      data.forEach((res, index) => {
        res = match.toString();
        console.log(` ▢ 🌀 ↪  (SERVICE)[${index}]⇢ ${res} |ID⇢[${eid}]`);
      });
    } else {
      console.log(` ▢ 🌀 ↪ (SERVICE)⇢ ${data} |ID⇢[${eid}]`);
    }
  }

  static error(title, errorObject) {
    if (errorObject instanceof Error) {
      const eid = Math.round(Math.random() * 10000);

      const stackRegex = /at\s(.*?)\s\((.*?):(\d+):(\d+)\)/g;
      const matches = [...errorObject.stack.matchAll(stackRegex)];
      Logger.parseLogEntry(
        ` ▣ ↪ ⚠️ ERROR! [${eid}][${title}] (type Error) ⇨ ${errorObject.name} `,
        errorObject.message,
        ``
      );

      matches.forEach((match, index) => {
        console.log(
          ` ▢ ↪ [${eid}][${index}] Function⇢ ${match[1]}, File⇢ ${match[2]}, Line⇢ ${match[3]}, Column⇢ ${match[4]}`
        );
      });
    } else if (typeof errorObject === "object") {
      let message, code;
      if (typeof errorObject.data === "object") {
        message = errorObject.data.message;
        code = errorObject.meta.code;
      } else if (errorObject.message) {
        message = errorObject.message;
      } else {
        message = JSON.stringify(errorObject);
      }

      Logger.parseLogEntry(
        `▣ ↪ ⚠️ [ ${code ? code : "UNKNOWN"} ERROR! ] (object)`,
        title,
        JSON.stringify(message)
      );
    } else {
      Logger.parseLogEntry(
        "▣ ↪ ⚠️ [UNKNOWN ERROR] (string)",
        title,
        JSON.stringify(errorObject)
      );
    }
  }
}
const loggerObject = new Logger();
exports.Logger = loggerObject;

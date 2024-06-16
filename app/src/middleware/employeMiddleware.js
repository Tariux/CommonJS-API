
const XValidate = require("../../helper/validate");
const { FA } = require("../../languages/lang");

function getEmployeMiddleware(body) {
    if (XValidate.isEmpty(body.id)) {
        throw({
            message: FA.PLEASE_ENTER_ID
        })
    }
    return true

}
function createEmployeMiddleware(body) {
    //const {id, body, parent} = body;
    if (!body.id || !body.parent || !body.data) {
        throw({
          message: FA.INVALID_USER_DATA,
        });
    }
    if (XValidate.isEmpty(body.data.name)) {
        throw({
            message: FA.INVALID_USER_DATA,
        });
    }

    return true
}
function dropEmployeMiddleware(body) {
    if (!body.id) {
        throw({
            message: FA.INVALID_USER_DATA,
        });
    }

    return true
}

function updateEmployeMiddleware(body) {
    if ((!body.id && !body.parent && !body.data) || 
    Object.keys(body.data).length <= 0
    ) {   
      return {
        message: FA.PLEASE_SEND_DATA,
    };
    }
    

    return true
}

module.exports = {getEmployeMiddleware , createEmployeMiddleware , dropEmployeMiddleware , updateEmployeMiddleware}
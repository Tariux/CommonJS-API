const XValidate = require("../../helper/validate");

function getEmployeMiddleware(body) {
    if (XValidate.isEmpty(body.id)) {
        throw({
            message: 'آیدی کاربر را لطفا وارد کنید!'
        })
    }
    return true

}
function createEmployeMiddleware(body) {
    if (!body.id || !body.parent || !body.data) {
        throw({
          message: "اطلاعات وارد شده صحیح نیست!",
        });
    }
    if (XValidate.isEmpty(body.data.name)) {
        throw({
            message: "اطلاعات کاربر وارد شده صحیح نیست!",
        });
    }

    return true
}
function dropEmployeMiddleware(body) {
    if (!body.id) {
        throw({
          message: "اطلاعات وارد شده صحیح نیست!",
        });
    }

    return true
}

function updateEmployeMiddleware(body) {
    if ((!body.id && !body.parent && !body.data) || 
    Object.keys(body.data).length <= 0
    ) {   
      return {
        message: "لطفا مقدار برای بروزرسانی وارد کنید!",
      };
    }
    

    return true
}

module.exports = {getEmployeMiddleware , createEmployeMiddleware , dropEmployeMiddleware , updateEmployeMiddleware}
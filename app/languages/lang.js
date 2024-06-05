const { XHelper } = require("../helper/functions");

class XLang {
    __x(lang = "fa") {
        console.log(lang);
        return true
    }
}

module.exports = {XLang}

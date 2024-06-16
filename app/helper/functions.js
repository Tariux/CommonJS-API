class XHelper {
  static findItemsByKeyValueInArray(items, key, value) { // find items by key and value
    return items.filter((item) => item[key] === value);
  }
  
  static getUrlParameters(url) { // ? get url paramets ?x=1
    var out = {};
    var str = url.search.replace("?", "");
    var subs = str.split(`&`).map((si) => {
      var keyVal = si.split(`=`);
      out[keyVal[0]] = keyVal[1];
    });
    return out;
  }

  static checkThe (value) { // ? this will check force a value
    if (typeof value === 'boolean') {
      return value
    }
    return (
      // ! null or undefined
      (value == null) ||
      (value == false) ||

      // ! has length and it's zero
      (value.hasOwnProperty('length') && value.length === 0) ||
  
      // ! is an Object and has no keys
      (value.constructor === Object && Object.keys(value).length === 0)
    )
  }
  
}

module.exports = { XHelper };

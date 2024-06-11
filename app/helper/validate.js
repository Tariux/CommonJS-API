class XValidate { // ? this class will validate data types/variables
    // String validation
    static isEmpty(str) {
      return !str || !str.trim();
    }
  
    static isString(str) {
      return typeof str === 'string';
    }
  
    static isNotBlank(str) {
      return this.isString(str) && str.trim() !== '';
    }
  
    // Array validation
    static isEmptyArray(arr) {
      return !arr || arr.length === 0;
    }
  
    static isArray(arr) {
      return Array.isArray(arr);
    }
  
    static isNotEmptyArray(arr) {
      return this.isArray(arr) && arr.length > 0;
    }
  
    // Object validation
    static isEmptyObject(obj) {
      return !obj || Object.keys(obj).length === 0;
    }
  
    static isObject(obj) {
      return typeof obj === 'object';
    }
  
    static isNotEmptyObject(obj) {
      return this.isObject(obj) && Object.keys(obj).length > 0;
    }
  
    // Array of objects validation
    static isEmptyArrayOfObjects(arr) {
      return this.isEmptyArray(arr) || this.isEmptyObject(arr[0]);
    }
  
    static isArrayOfObjects(arr) {
      return this.isArray(arr) && arr.every(this.isObject);
    }
  
    static isNotEmptyArrayOfObjects(arr) {
      return this.isArrayOfObjects(arr) && arr.length > 0;
    }
  
    // Other validation
    static isBoolean(bool) {
      return typeof bool === 'boolean';
    }
  
    static isNumber(num) {
      return typeof num === 'number';
    }
  
    static isFiniteNumber(num) {
      return this.isNumber(num) && !isNaN(num);
    }
  
    static isEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    }
  
    static isUrl(url) {
      const re = /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(url);
    }
  }

  module.exports = XValidate
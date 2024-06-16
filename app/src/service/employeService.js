const { Redis } = require("../../database/redis");
const { FA } = require("../../languages/lang");

class EmployeService {
  constructor() {
    this.initDefaultEmploye(); // ? this will init default user after calling this service
  }

  async initDefaultEmploye() {
    // ? this function creates a default user for initialize program
    try {
      // ? making the keys
      let defaultKey = `employe:1`;
      let defaultEmploye = await Redis.employe.hGetAll(defaultKey); // ? get data for check created before or not

      if (Object.keys(defaultEmploye).length <= 0) {
        // ? check if is not created
        let defaultData = {
          // ? making data template
          name: "default",
          age: "default",
        };

        await Redis.employe.hSet(defaultKey, {
          id: 1,
          data: JSON.stringify(defaultData),
          is_parent : 'true'
        }); // * this will creates a default user by data and response
        return true;
      } else {
        // * return default data if created before
        return defaultEmploye;
      }
    } catch (error) {
      return {
        message: FA.FAIL,
        response: error,
        statusCode: 400,

      };
    }
  }

  async getEmploye(id) {
    try {
      // ? make the keys
      let employe_key = `employe:${id}`;

      let employeData = await Redis.employe.hGetAll(employe_key); // ? get employe data
      if (Object.keys(employeData).length > 0) {
        // ! validate employe exists or not
        return { response: employeData , message: FA.GET_USER_SUCCESS }; // * send response
      } else {
        return {
          status: false,
          statusCode: 400,
          message: FA.GET_USER_FAIL
        }; // ! send error
      }

    } catch (error) {
      return {
        // ! send error
        message: FA.GET_USER_FAIL,
        response: error,
        statusCode: 400,
      };
    }
  }

  async createEmploye(id, parent, data , is_parent = false) {
    // ? make the keys
    let employe_key = `employe:${id}`;
    let parent_key = `parent:${id}`;
    let employe_parent_key = `employe:${parent}`;
    
    let [parentData , checkEmploye] = await Promise.all(
    [
      Redis.employe.hGetAll(employe_parent_key), // ! get parent data for check exists and access
      Redis.employe.hGetAll(employe_key),
    ]
    )
    if (Object.keys(checkEmploye).length > 0) { // ? check user exists or not
      return {
        // ! send error
        message: FA.DUPLICATE_USER,
        status: false,
        statusCode: 500,
      };
    }

    if (Object.keys(parentData).length <= 0) { // ? check parent exist or not
      return {
        // ! send error PARENT_NOT_FOUND
        message: FA.PARENT_NOT_FOUND,
        status: false,
        statusCode: 400,
      };
    }

    if (parentData.is_parent !== 'true') { // ? check parent have access or not
      return {
        // ! send error USER_CAN_NOT_BE_PARENT
        message: FA.USER_CAN_NOT_BE_PARENT,
        status: false,
        statusCode: 400,
      };
    }

    const employeHaveParent = await Redis.parent.hGetAll(parent_key)
    if (Object.keys(employeHaveParent) > 0) { // ? check have already a parent or not
      return {
        // ! send error USER_ALREADY_HAVE_PARENT
        message: FA.USER_ALREADY_HAVE_PARENT,
        status: false,
        statusCode: 400,
      };
    }


    let employeData = {
      // ? make data ready from template
      id: id,
      data: JSON.stringify(data),
      is_parent: is_parent.toString()
    };

    try {

      if (!is_parent) {
        await Redis.parent.set(parent_key, parent); // ? create parent relation
      }
      let createEmploye = await Redis.employe.hSet(employe_key, employeData); // ? create employe data

      return {
        message: FA.ADD_USER_SUCCESS,
        response: (createEmploye) ? true : false,
      };
    } catch (error) {
      
      return {
        message: FA.ADD_USER_FAIL,
        response: error,
        statusCode: 400,
      };
    }
  }

  async dropEmploye(id) {
    try {
      // ? try to make the keys
      let employe_key = `employe:${id}`;
      let parent_key = `parent:${id}`;

      let employeData = await Redis.employe.hGetAll(employe_key); // ? get employe data by sent "id"
      if (Object.keys(employeData).length <= 0) {
        // ! check employe exists or not
        return {
          message: FA.USER_NOT_FOUND,
        };
      }

      await Promise.all([
        Redis.employe.del(employe_key), // ? delete employe data
        Redis.parent.del(parent_key), // ? delete parent relation key
      ]).catch((err) => {
        return {
          // ! send error
          message: FA.DELETE_USER_FAIL,
          response: true,
        };
      });

      return { // * send response true
        message: FA.DELETE_USER_SUCCESS,
        response: true
      };

    } catch (error) {
      return {
        // ! send error
        message: FA.DELETE_USER_FAIL,
        response: error,
        statusCode: 400,

      };
    }
  }

  async updateEmploye(id, parent, data) {
    // ? making keys
    let employe_key = `employe:${id}`;
    let parent_key = `parent:${id}`;
    let employe_parent_key = `employe:${parent}`;

    let [parentData , employeData] = await Promise.all(
      [
        Redis.employe.hGetAll(employe_parent_key), // ! get parent data for check exists and access
        Redis.employe.hGetAll(employe_key), // ! get parent data for check exists and access
      ]
      )
  
    // ! check employe exists
    if (Object.keys(employeData).length <= 0) {
      return {
        message: FA.USER_NOT_FOUND,
      };
    }

    // ! check parent exists
    if (Object.keys(parentData).length <= 0) {
      return {
        message: FA.PARENT_NOT_FOUND,
      };
    }

    if (parentData.is_parent !== 'true') { // ? check parent have access or not
      return {
        // ! send error USER_CAN_NOT_BE_PARENT
        message: FA.USER_CAN_NOT_BE_PARENT,
        status: false,
        statusCode: 400,
      };
    }

    let newData = {
      // ? make new data from template
      id: id,
      data: JSON.stringify(data),
    };

    try {
      await Redis.employe.hSet(employe_key, newData); // ? update employe
      await Redis.parent.set(parent_key, parent); // ? update parent

      newData.data = JSON.parse(newData.data); // ? restore newData to JSON

      return {
        // * send response
        message: FA.UPDATE_USER_SUCCESS,
        response: newData,
      };
    } catch (error) {
      return {
        // ! send error
        message: FA.UPDATE_USER_FAIL,
        response: error,
        statusCode: 400,
      };
      
    }
  }
}

module.exports = { EmployeService };

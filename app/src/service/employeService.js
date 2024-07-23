const { Redis } = require("../../database/redis");
const { FA } = require("../../languages/lang");
const { EmployeWorker } = require("./worker/employeWorker");

class EmployeService {

  constructor() {
    this.worker = new EmployeWorker()
  }
  
  /**
   * Get employe data by ID
   * @param {string} id - Employe ID
   * @returns {Promise<Object>} Employe data or error message
   */
  async getEmploye(id) {
    try {
      // ? make the keys
      let employe_key = `employe:${id}`;

      let employeData = await Promise.all([ // ? Promise.all is for optimize this can be seprate
        this.worker.getEmploye(employe_key), // ? get employe data
        this.worker.getAllUserChilds(id) // ? get all user childs
      ]).then(([data, childs]) => {
        data.data = {
          ...JSON.parse(data.data),
          childs: childs,
        };
        return data;
      });

      return {
        response: {
          ...employeData,
        },
        message: FA.GET_USER_SUCCESS,
      }; // * send response
    } catch (error) {
      console.log(error);

      return {
        // ! send error
        message: FA.GET_USER_FAIL,
        response: error,
        statusCode: 400,
      };
    }
  }

  /**
   * Create a new employe
   * @param {string} id - Employe ID
   * @param {Object} data - Employe data
   * @returns {Promise<Object>} Success or error message
   */
  async createEmploye(id, data) {
    // ? make the keys
    let employe_key = `employe:${id}`;
    let parent_key = `parent:${id}`;
    // let employe_parent_key = `employe:${parent}`;

    let checkEmploye = await this.worker.getEmploye(employe_key);
    // this.worker.getEmploye(employe_parent_key), // ! get parent data for check exists and access
    console.log('checkEmploye' , checkEmploye);
    if (checkEmploye) {
      // ? check user exists or not
      return {
        // ! send error
        message: FA.DUPLICATE_USER,
        status: false,
        statusCode: 500,
      };
    }

    const employeHaveParent = await this.worker.getEmploye(parent_key);
    if (employeHaveParent) {
      // ? check have already a parent or not
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
    };

    try {
      let createEmploye = await Redis.employe.hSet(employe_key, employeData); // ? create employe data

      return {
        message: FA.ADD_USER_SUCCESS,
        response: createEmploye ? true : false,
      };
    } catch (error) {
      return {
        message: FA.ADD_USER_FAIL,
        response: error,
        statusCode: 400,
      };
    }
  }

  /**
   * Delete an employe by ID
   * @param {string} id - Employe ID
   * @returns {Promise<Object>} Success or error message
   */
  async dropEmploye(id) {
    try {
      // ? try to make the keys
      let employe_key = `employe:${id}`;
      let parent_key = `parent:${id}`;

      let employeData = await this.worker.getEmploye(employe_key); // ? get employe data by sent "id"
      if (!employeData) {
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
        };
      });

      return {
        // * send response true
        message: FA.DELETE_USER_SUCCESS,
        response: true,
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

  /**
   * Update employe data by ID
   * @param {string} id - Employe ID
   * @param {Object} data - New employe data
   * @returns {Promise<Object>} Success or error message
   */
  async updateEmploye(id, data) {
    try {
      const newData = await this.worker.updateEmployeProfile(id, data);

      // await this.updateParentID(id , parent)

      return {
        // * send response
        message: FA.UPDATE_USER_SUCCESS,
        response: newData,
      };
    } catch (error) {
      console.log("updateEmploye", error);
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

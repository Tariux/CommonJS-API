const { Redis } = require("../../database/redis");
const { FA } = require("../../languages/lang");

class EmployeService {

  /**
   * Get employe data by ID
   * @param {string} id - Employe ID
   * @returns {Promise<Object>} Employe data or error message
   */
  async getEmploye(id) {
    try {
      // ? make the keys
      let employe_key = `employe:${id}`;

      let employeData = await Redis.employe.hGetAll(employe_key); // ? get employe data
      if (Object.keys(employeData).length > 0) {
        // ! validate employe exists or not
        employeData.data = {
          ...JSON.parse(employeData.data),
          childs: await this.getAllUserChilds(id),
        };

        return {
          response: {
            ...employeData,
          },
          message: FA.GET_USER_SUCCESS,
        }; // * send response
      } else {
        return {
          status: false,
          statusCode: 400,
          message: FA.GET_USER_FAIL,
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

    let checkEmploye = await Redis.employe.hGetAll(employe_key)
      // Redis.employe.hGetAll(employe_parent_key), // ! get parent data for check exists and access
   
    if (Object.keys(checkEmploye).length > 0) {
      // ? check user exists or not
      return {
        // ! send error
        message: FA.DUPLICATE_USER,
        status: false,
        statusCode: 500,
      };
    }


    const employeHaveParent = await Redis.parent.hGetAll(parent_key);
    if (Object.keys(employeHaveParent) > 0) {
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
      console.log(error);
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
      const newData = await this.updateEmployeProfile(id, data);

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

  /**
   * Update employe profile data
   * @param {string} userID - Employe ID
   * @param {Object} data - New employe data
   * @returns {Promise<Object|boolean>} Updated employe data or false
   */
  async updateEmployeProfile(userID, data) {
    let employeKey = `employe:${userID}`;

    let employeData = await Redis.employe.hGetAll(employeKey);
    // ! check employe exists
    if (!employeData) {
      throw {
        message: FA.USER_NOT_FOUND,
      };
    }

    let newData = {
      // ? make new data from template

      id: userID,
      data: JSON.stringify({
        ...JSON.parse(employeData.data),
        ...data,
      }),
    };

    if (data.parent && data.parent !== '') {
      const assign = await this.assignParent(userID , data.parent)
      console.log('assign parent to user' , assign);
    }

    try {
      await Redis.employe.hSet(employeKey, newData); // ? update employe
      newData.data = JSON.parse(newData.data); // ? restore newData to JSON

      return newData;
    } catch (error) {
      console.log("updateEmploye error", error);
      return false;
    }
  }

  /**
   * Assign a parent to an employe
   * @param {string} userID - Employe ID
   * @param {string} parentID - Parent ID
   * @returns {Promise<Object|boolean>} Success message or false
   */
  async assignParent(userID, parentID) {
    const parentKey = `parent:${userID}`;
    try {
      const parentData = await Redis.employe.hGetAll(`employe:${parentID}`);

      if (
        Object.keys(parentData).length <= 0 
      ) {
        return {
          message: FA.PARENT_NOT_FOUND,
          status: false,
          statusCode: 400,
        };
      }

      await Redis.parent.set(parentKey, parentID); // ? assign parent
      return true;
    } catch (error) {
      console.log("assignParent error", error);
      return false;
    }
  }

  /**
   * Get all child employes by parent ID
   * @param {string} parentID - Parent ID
   * @returns {Promise<Array|boolean>} List of child employes or false
   */
  async getAllUserChilds(parentID) {
    try {
      const childEmployes = [];
      const keys = await Redis.parent.keys(`parent:*`);

      for (const key of keys) {
        const storedParentID = await Redis.parent.get(key);
        if (storedParentID === parentID) {
          const userID = key.split(":")[1];
          const employeData = await Redis.employe.hGetAll(`employe:${userID}`);
          childEmployes.push(employeData);
        }
      }

      return childEmployes;
    } catch (error) {
      return false;
    }
  }
}

module.exports = { EmployeService };

const { Redis } = require("../../../database/redis");
const { FA } = require("../../../languages/lang");

class EmployeWorker {
    
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



  /**
   * Update employe profile data
   * @param {string} userID - Employe ID
   * @param {Object} data - New employe data
   * @returns {Promise<Object|boolean>} Updated employe data or false
   */
  async updateEmployeProfile(userID, data) {
    let employeKey = `employe:${userID}`;

    let employeData = await this.getEmploye(employeKey);
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

    if (data.parent && data.parent !== "") {
      const assign = await this.assignParent(userID, data.parent);
      console.log("assign parent to user", assign);
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
        let parentEmployeKey = `employe:${parentID}`
      const parentData = await this.getEmploye(parentEmployeKey);
      if (!parentData) {
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


  async getEmploye(employe_key) {
    let employeData = await Redis.employe.hGetAll(employe_key); // ? get employe data by sent "id"

    if (employeData && typeof employeData === 'object' && Object.keys(employeData).length > 0) {
        // ! check employe exists or not
        return employeData;
    } else {
        return false;
    }
  }

}

module.exports = { EmployeWorker };

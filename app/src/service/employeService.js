const { Redis } = require("../../database/redis");
const { XHelper } = require("../../helper/functions");

class EmployeService {
  constructor() {
    this.initDefaultEmploye();
  }

  async initDefaultEmploye() {
    try {
      let defaultKey = `employe:1`;
      let defaultEmploye = await (await Redis.employe).hGetAll(defaultKey);

      if (Object.keys(defaultEmploye).length <= 0) {
        let defaultData = {
          fname: "default",
          lname: "default",
          age: "default",
        };
        const createDefault = await (
          await Redis.employe
        ).hSet(defaultKey, { id: 1, data: JSON.stringify(defaultData) });
        return {
          message: "کاربر دیفالت اضافه شد با شناسه 1 دوباره امتحان کنید",
          response: createDefault,
        };
      } else {
        return defaultEmploye;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getEmploye(id) {
    if (!id) {
      return false;
    }
    try {
      let employe_key = `employe:${id}`;

      let employeData = await (await Redis.employe).hGetAll(employe_key);
      if (Object.keys(employeData).length > 0) {
        return { response: employeData };
      } else {
        return false
      }
    } catch (error) {
      return false;
    }
  }

  async createEmploye(id, parent, data) {
    if (!id || !parent || !data) {
      return {
        message: "اطلاعات وارد شده صحیح نیست!",
      };
    }

    let employe_key = `employe:${id}`
    let parent_key = `parent:${id}`
    let employe_parent_key = `employe:${parent}`

    let parentData = await (await Redis.employe).hGetAll(employe_parent_key);

    if (Object.keys(parentData).length <= 0) {
      return({
        message: "این کاربر والد وجود ندارد!",
      })
    }

    let employeData = {
      id: id,
      data: JSON.stringify(data),
    };

    try {

      
      let createEmploye = await (
        await Redis.employe
      ).hSet(employe_key, employeData);
      await (await Redis.parent).set(parent_key, parent);
      return createEmploye;
    } catch (error) {
      console.log(error);
      return {
        message: "خطایی در انجام عملیات ایجاد شد!",
        response: error,
      };
    }
  }


  async dropEmploye(id) {
    if (!id) {
      return false;
    }
    try {
      let eid = id || false;
      let employe_key = `employe:${eid}`;
      let parent_key = `parent:${eid}`;

      let employeData = await (await Redis.employe).hGetAll(employe_key);

      if (Object.keys(employeData).length <= 0) {
        return({
          message: "این کارمند وجود ندارد!",
        })
      }

      await (await Redis.employe).del(employe_key);
      await (await Redis.parent).del(parent_key);

      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = { EmployeService };
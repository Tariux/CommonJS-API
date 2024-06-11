const { Redis } = require("../../database/redis");

class EmployeService {
  constructor() {
    this.initDefaultEmploye(); // ? this will init default user after calling this service
  }

  async initDefaultEmploye() { // ? this function creates a default user for initialize program
    try {

      // ? making the keys
      let defaultKey = `employe:1`;

      let defaultEmploye = await Redis.employe.hGetAll(defaultKey); // ? get data for check created before or not

      if (Object.keys(defaultEmploye).length <= 0) { // ? check if is not created
        let defaultData = { // ? making data template
          name: "default",
          age: "default",
        };
        const createDefault = await Redis.employe.hSet(defaultKey, { id: 1, data: JSON.stringify(defaultData) }); // * this will creates a default user by data and response
        return {
          message: "کاربر دیفالت اضافه شد با شناسه 1 دوباره امتحان کنید",
          response: createDefault,
        };
      } else { // * return default data if created before
        return defaultEmploye;
      }
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        response: error,
      };
    }
  }

  async getEmploye(id) {

    try {

      // ? make the keys
      let employe_key = `employe:${id}`;

      let employeData = await Redis.employe.hGetAll(employe_key); // ? get employe data
      if (Object.keys(employeData).length > 0) { // ! validate employe exists or not
        return { response: employeData }; // * send response
      } else {
        return {
          status: false,
          statusCode: 500,  
        } // ! send error
      }
    } catch (error) {
      return { // ! send error
        status: false,
        statusCode: 500,
        response: error,
      };
    }
  }

  async createEmploye(id, parent, data) {


    // ? make the keys
    let employe_key = `employe:${id}`
    let parent_key = `parent:${id}`
    let employe_parent_key = `employe:${parent}`

    let parentData = await Redis.employe.hGetAll(employe_parent_key); // ! check parent exists or not
    if (Object.keys(parentData).length <= 0) { 
      return({ // ! send error
        message: "این کاربر والد وجود ندارد!",
        status: false,
        statusCode: 500,

      })
    }



    let checkEmploye = await Redis.employe.hGetAll(employe_key); // ! check employe exists or not
    if (Object.keys(checkEmploye).length > 0) {
      return({ // ! send error
        message: "این شناسه کاربر وجود دارد!",
        status: false,
        statusCode: 500,
      })
    }

    let employeData = { // ? make data ready from template
      id: id,
      data: JSON.stringify(data),
    };

    try {
      
      let createEmploye = await Redis.employe.hSet(employe_key, employeData); // ? create employe data

      await Redis.parent.set(parent_key, parent); // ? create parent relation

      return createEmploye;  // * send response

    } catch (error) {
      return {
        message: "خطایی در انجام عملیات ایجاد شد!",
        status: false,
        statusCode: 500,
        response: error,

      };
    }
  }


  async dropEmploye(id) {

    try {

      // ? try to make the keys
      let eid = id;
      let employe_key = `employe:${eid}`;
      let parent_key = `parent:${eid}`;

      let employeData = await Redis.employe.hGetAll(employe_key); // ? get employe data by sent "id"

      if (Object.keys(employeData).length <= 0) { // ! check employe exists or not
        return({
          message: "این کارمند وجود ندارد!",
        })
      }

      await Redis.employe.del(employe_key); // ? delete employe data
      await Redis.parent.del(parent_key); // ? delete parent relation key

      return true; // * send response true

    } catch (error) {
      return { // ! send error
        status: false,
        statusCode: 500,
        response: error,
      };
        }
  }


  async updateEmploye(id, parent, data) {
    // ? making keys
    let employe_key = `employe:${id}`
    let parent_key = `parent:${id}`
    let employe_parent_key = `employe:${parent}`


    // ! check employe exists
    let employeData = await Redis.employe.hGetAll(employe_key);
    if (Object.keys(employeData).length <= 0) {
      return({
        message: "این کاربر وجود ندارد!",
        
      })
    }

    // ! check parent exists
    let parentData = await Redis.employe.hGetAll(employe_parent_key);
    if (Object.keys(parentData).length <= 0) {
      return({
        message: "این کاربر والد وجود ندارد!",
      })
    }

    


      let newData = { // ? make new data from template
        id: id,
        data: JSON.stringify(data),
      }

      try {
        // TODO: understand this how it works
        try {
          
        } catch (error) {
          
        }
        await Redis.employe.hSet(employe_key, newData); // ? update employe
        await Redis.parent.set(parent_key, parent); // ? update parent

        newData.data = JSON.parse(newData.data) // ? restore newData to JSON

        return { // * send response
          message: "عملیات بروزرسانی با موفقیت انجام شد",
          response: newData
        }

      } catch (error) {
          return { // ! send error
            message: "خطایی در بروزرسانی اطلاعات پیش آمد!", 
            status: false,
            statusCode: 500,
            response: error
          }
      }



  }

}

module.exports = { EmployeService };
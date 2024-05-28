const XResponse = require("../callback/response");
const XResult = require("../helper/error");

class EmployeModule extends XResponse {
  constructor(request, response) {
    super(request, response);
  }
  index() {
    this.getEmploye();
  }

  post() {
    this.updateEmploye();
  }

  update() {
    this.updateEmploye(false);
  }

  drop() {
    this.dropEmploye();
  }

  getEmploye() {
    if (!this.body.id) {
      new XResult("Enter Employe ID!", this.response, 422);
      return false;
    }
    this.redis.safeQuery(async () => {
      try {
        let eid = this.body.id || false;
        let employe_key = `employe:${eid}`;
        let parent_key = `parent:${eid}`;

        this.redis.selectEmployeDB();
        let employeData = await this.redis.client.hGetAll(employe_key);
        this.redis.selectParentDB();
        let parentData = await this.redis.client.hGetAll(parent_key);

        let response = {
          ...employeData,
          parent_data:
            Object.keys(parentData).length > 0 ? parentData : false,
        }
        console.log(response);
      new XResult("Successfully!", this.response, 200 , response);

      } catch (error) {
        new XResult("Error Happen In Fetch!", this.response, 500);

        console.log(error);
        return false;
      }
    });
  }
  updateEmploye(isNew = true) {
    if (this.body.length <= 0) {
      return false;
    }
    this.redis.safeQuery(async () => {
      try {
        let employe_id;
        if (this.body.id && this.body.id !== "") {
          employe_id = this.body.id;
        } else {
          employe_id = await this.redis.employeUniqueID();
        }
        let parent_id = this.body.parent || false;
        let employe_key = `employe:${employe_id}`;
        let employe_parent_key = `employe:${parent_id}`;
        let parent_key = `parent:${employe_id}`;

        this.redis.selectEmployeDB();
        let parent_check = await this.redis.client.hGetAll(employe_parent_key);
        console.log(this.body);
        if (!parent_check || Object.keys(parent_check).length <= 0) {
          console.log("Parent Does not found");
          new XResult("Parent Does Not Found!", this.response, 404);

          return false;
        }

        let employe_check = await this.redis.client.hGetAll(employe_key);
        if (
          isNew === false &&
          (!employe_check || Object.keys(employe_check).length <= 0)
        ) {
          console.log("Employe Does not found");
          new XResult("Employe Not Found!", this.response, 404);

          return false;
        }

        this.redis.selectEmployeDB();
        let new_employe = {
          id: employe_id,
          data: JSON.stringify(this.body),
        }
        await this.redis.client.hSet(employe_key, new_employe);


        this.redis.selectParentDB();
        let new_parent = {
          id: parent_id,
          parent: employe_id,
        }
        await this.redis.client.hSet(parent_key, new_parent);

        
        new XResult(`${employe_key} Created!`, this.response, 200 , {
          "parent" : new_parent,
          "employe" : new_employe,
        });

      } catch (error) {
        console.log(`Failed to Create Employe`, error);
        new XResult("Failed to Create Employe!", this.response, 500);

      }
    });
  }
  dropEmploye() {
    console.log('BODY ' , this.body);
    if (!this.body.id) {
      new XResult("Invalid Input Data!", this.response, 422);
    }
    this.redis.safeQuery(async () => {
      try {
        let eid = this.body.id || false;
        let employe_key = `employe:${eid}`;
        let parent_key = `parent:${eid}`;

        this.redis.selectEmployeDB();
        let employeData = await this.redis.client.del(employe_key);
        this.redis.selectParentDB();
        let parentData = await this.redis.client.del(parent_key);

        if (parentData && employeData) {
          new XResult("Deleted!", this.response, 200);
          console.log(`deleted! ${employe_key}`);
          console.log(`deleted! ${parent_key}`);
          new XResult(
            {
              parent: parentData,
              employe: employeData,
            },
            this.response,
            500
          );

          return true;
        } else {
          new XResult("Delete Failed!", this.response, 500);
        }
      } catch (error) {
        new XResult("Someting Bad Happen!", this.response, 500);
      }
    });
  }
}
module.exports = EmployeModule;

const XResponse = require("../callback/response");

class EmployeModule extends XResponse {
  constructor(request, response) {
    super(request, response);
  }
  index() {
    this.sendView("home");
  }

  post() {
    this.addEmploye();
  }
  drop() {}
  update() {}

  async addEmploye() {
    await this.initDB();

    return new Promise(async (resolve, reject) => {
      try {
        let eid = await this.redis.generateEmployeID(this.employeDB);
        let pid = await this.redis.generateParentID(this.parentDB);
        await this.employeQuery(eid, this.body.data);
        await this.parentQuery(pid, eid);
        console.log(`Employe no:${eid} Created!`);
        resolve(eid);
      } catch (error) {
        console.log(`Failed to Create Employe`, error);
        resolve(false);
      }
    });
  }
  async employeQuery(id, data) {
    let insertData = {
      id: id,
      data: data || {},
    };
    let insert = await this.employeDB.set(
      `employe:${id}`,
      JSON.stringify(insertData)
    );
    return insert ? insert : false;
  }
  async parentQuery(id, child) {
    let insertData = {
      id: id,
      child: child
    };
    let insert = await this.parentDB.set(
      `parent:${id}`,
      JSON.stringify(insertData)
    );
    return insert ? insert : false;
  }
}

module.exports = EmployeModule;

const { _cr } = require("../../helper/client-response");
const { XHelper } = require("../../helper/functions");
const { ModuleInit } = require("../moduler");
const { EmployeService } = require("../service/employeService");

class EmployeController extends ModuleInit {
  constructor(req , res) {
    super(req , res)
    this.service = new EmployeService()
  }
  async index() {
    const get = await this.service.getEmploye(this.body.id)
    if (XHelper.isEmpty(get)) {
      _cr(this.response , 404 , 'هیچ کاربری با این آیدی پیدا نشد!' , false);

    } else {
      _cr(this.response , 200 , 'کاربر مورد نظر یافت شد' , get);

    }
  }

  post() {
    this.service.updateEmploye();
  }

  update() {
    this.service.updateEmploye(false);
  }

  drop() {
    this.service.dropEmploye();
  }


}
module.exports = {EmployeController};

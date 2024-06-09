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
    if (get) {
      _cr(this.response , 200 , 'کاربر مورد نظر یافت شد' , get);

    } else {
      _cr(this.response , 404 , 'هیچ کاربری با این آیدی پیدا نشد!' , get);

    }
  }

  async post() {
    

    const post = await this.service.createEmploye(this.body.id , this.body.parent , this.body.data);
    if (post) {
      _cr(this.response , 200 , 'کاربر با موفقیت ایجاد شد!' , post);

    } else {
      _cr(this.response , 500 , 'عملیات ناموفق بود!' , post);

    }
  }

  update() {
    this.service.updateEmploye(false);
  }

  async drop() {
    const drop = await this.service.dropEmploye(this.body.id);
    if (drop) {
      _cr(this.response , 200 , 'کاربر با موفقیت حذف شد!' , drop);

    } else {
      _cr(this.response , 500 , 'عملیات ناموفق بود!' , drop);

    }
  }


}
module.exports = {EmployeController};

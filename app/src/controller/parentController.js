const { _ClientResponse } = require("../../helper/ClientResponse");
const { FA } = require("../../languages/lang");
const { ModuleInit } = require("../moduler");
const { EmployeService } = require("../service/employeService");

class ParentController extends ModuleInit {

  constructor(req , res) {
    super(req , res) // ? this will parse all data for module
    this.service = new EmployeService() // ? and this is for calling the service
  }

  async index() {
    try {
      const get = await this.service.getChilds(this.body.id);
      if (get) {
        return _ClientResponse(this.response , get);
      } else {
        return _ClientResponse(this.response , FA.GET_USER_FAIL , 400);
      }
    } catch (error) {
      console.log('index ERROR:::' , error);
      return _ClientResponse(this.response , FA.GET_USER_FAIL , 400);
    }
  }



}
module.exports = {ParentController};

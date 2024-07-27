const { _ClientResponse } = require("../../helper/ClientResponse");
const { FA } = require("../../languages/lang");
const { ModuleInit } = require("../moduler");
const { EmployeService } = require("../service/employeService");

class EmployeController extends ModuleInit {

  constructor(req , res) {
    super(req , res) // ? this will parse all data for module
    this.service = new EmployeService() // ? and this is for calling the service
  }

  async index() {
    try {
      const get = await this.service.getEmploye(this.body.id);
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

  async post() {
    try {
      const post = await this.service.createEmploye(this.body.id , this.body.data);
      if (post) {
        return _ClientResponse(this.response , post);
      } else {
        return _ClientResponse(this.response , FA.ADD_USER_FAIL , 400);
      }
    } catch (error) {
      console.log('post ERROR:::' , error);
      return _ClientResponse(this.response , FA.ADD_USER_FAIL , 400);
    }
  }

  async update() {
    try {
      const update = await this.service.updateEmploye(this.body.id ,  this.body.data);
      if (update) {
        return _ClientResponse(this.response , update);
      } else {
        return _ClientResponse(this.response , FA.UPDATE_USER_FAIL , 400);
      }
    } catch (error) {
      console.log('update ERROR:::' , error);
      return _ClientResponse(this.response , FA.UPDATE_USER_FAIL , 400);
    }
  }

  async drop() {
    try {
      const drop = await this.service.dropEmploye(this.body.id);
      return _ClientResponse(this.response , drop);
    } catch (error) {
      console.log('drop ERROR:::' , error);
      return _ClientResponse(this.response , FA.DELETE_USER_FAIL , 400);
    }
  }

}
module.exports = {EmployeController};

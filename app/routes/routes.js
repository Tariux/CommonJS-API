const XRouter = require("../callback/router")
const { EmployeController } = require("../src/controller/employeController")

const router = new XRouter()
router.post("/employeeService" , EmployeController)
router.get("/employeeService" , EmployeController)
router.put("/employeeService" , EmployeController)
router.delete("/employeeService" , EmployeController)    



module.exports = {
    router
}



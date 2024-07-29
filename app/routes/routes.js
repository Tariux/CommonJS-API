const XRouter = require("../callback/router")
const { EmployeController } = require("../src/controller/employeController")
const { ParentController } = require("../src/controller/parentController")
const { dropEmployeMiddleware , getEmployeMiddleware, createEmployeMiddleware , updateEmployeMiddleware } = require("../src/middleware/employeMiddleware")

const router = new XRouter() // ? a router class-object for this app

router.post("/employeeService" , EmployeController , createEmployeMiddleware)
router.get("/employeeService" , EmployeController , getEmployeMiddleware)
router.put("/employeeService" , EmployeController , updateEmployeMiddleware)
router.delete("/employeeService" , EmployeController , dropEmployeMiddleware)    

router.get("/parentService" , ParentController , getEmployeMiddleware)

module.exports = {
    router
}



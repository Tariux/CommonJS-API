const EmployeModule = require("../module/employe");
const HomeModule = require("../module/home");

function RouteList() {
    return [
        {
            path: '/',
            callback: (req , res) => {
                new HomeModule(req , res)
    
            },
            method: 'GET',
        }, // default path
        {
            path: '/employeeService',
            callback: (req , res) => {
                new EmployeModule(req , res)
            
    
            },
            method: 'GET',
        },
        {
            path: '/employeeService',
            callback: (req , res) => {
                new EmployeModule(req , res)
    
            },
            method: 'POST',
        },
        
    ]
}

module.exports = {
    RouteList
}
const EmployeModule = require("../src/employe");
const HomeModule = require("../src/home");

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
        {
            path: '/employeeService',
            callback: (req , res) => {
                new EmployeModule(req , res)
    
            },
            method: 'PUT',
        },
        {
            path: '/employeeService',
            callback: (req , res) => {
                new EmployeModule(req , res)
    
            },
            method: 'DELETE',
        },
    ]
}

module.exports = {
    RouteList
}
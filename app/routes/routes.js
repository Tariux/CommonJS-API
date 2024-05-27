
function RouteList() {
    return [
        {
            path: '/',
            callback: (req , res) => {
                console.log('XYZ');
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Welcome to home page!');
    
            },
            method: 'GET',
        }, // default path
        {
            path: '/employeeService',
            callback: (req , res) => {
                console.log('employee Service');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Welcome to employee Service.');
    
            },
            method: 'GET',
        },
        {
            path: '/employeeService',
            callback: (req , res) => {
                console.log('employee Service');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('this is a secret POST employee Service.');
    
            },
            method: 'POST',
        },
        
    ]
}

module.exports = {
    RouteList
}
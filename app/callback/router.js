class XRouter
{
    routes = {
        '/' : (req , res) => {
            console.log('XYZ');
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Welcome to home page!');

        }, // default path
        '/employeeService' : (req , res) => {
            console.log('employee Service');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Welcome to employee Service.');

        },

        
    }

    addRoute(route , callback , params = []) {
        this.routes[route] = callback(params)
    }

    getRoutes() {
        return this.routes;
    }

    route(pathname, req, res) {
        if (typeof this.routes[pathname] === 'function') {
            // if route exists, call its handler function
            this.routes[pathname](req, res);
        } else {
            // if route doesn't exist, return a 404 Not Found response
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
}

module.exports = XRouter
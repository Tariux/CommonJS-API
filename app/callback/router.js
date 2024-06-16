const { FA } = require("../languages/lang");

class XRouter {
  routes = [];

  getRoutes() { // ? get all routes
    return this.routes;
  }

  add(route, method, callback , middleware) { // ? add and define new route to routes variable 
    this.routes[route] = this.routes[route] || {};

    this.routes[route][method] = { // ? set key and values for each route
      path: route,
      method: method,
      callback: callback,
      middleware: middleware,
      
    };
  }

  post(route, callback = () => {} , middleware = () => {return true}) { // ? define post
    this.add(route, "POST", callback , middleware);
  }

  get(route, callback = () => {} , middleware = () => {return true}) { // ? define get
    this.add(route, "GET", callback , middleware);
  }

  put(route, callback = () => {} , middleware = () => {return true}) { // ? define put
    this.add(route, "PUT", callback , middleware);
  }

  delete(route, callback = () => {} , middleware = () => {return true}) { // ? define delete
    this.add(route, "DELETE", callback , middleware);
  }

  async route(pathname, req, res, body) { // ? this function will do the routing job and call the called method and object
    const matchRoute = this.routes[pathname][req.method]; // ? find match route
    if ( // ? check route is defined or not
      !matchRoute ||
      typeof matchRoute !== "object" ||
      typeof matchRoute["callback"] !== "function"
    ) {
      throw FA.PAGE_NOT_FOUND;
    }

     // ? check route method is defined or not
    if (req.method !== matchRoute["method"]) {
      throw FA.REQUEST_NOT_FOUND;
    }
    if (matchRoute["middleware"](body)) { // ? calling the middleware for validate
      // * this is where all program will load Service/Controller and pass data -> req , res
      const calledObject = new matchRoute["callback"](req, res);
      const calledMethod = this.detectMethod(req);
      await calledObject[calledMethod](req , res);
    }
  }

  detectMethod(request) { // ? this will create a template is my modules for coding better just functions index/post/update/drop is callable
    switch (request.method) {
      case "GET":
        return "index";
      case "POST":
        return "post";
      case "PUT":
        return "update";
      case "DELETE":
        return "drop";
      default:
        return false;
    }
  }
}

module.exports = XRouter;

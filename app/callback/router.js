class XRouter {
  routes = [];
  add(route, method, callback) {
    this.routes[route] = this.routes[route] || {};

    this.routes[route][method] = {
      path: route,
      method: method,
      callback: callback,
    };
  }

  getRoutes() {
    return this.routes;
  }

  post(route, callback = () => {}) {
    this.add(route, "POST", callback);
  }
  get(route, callback = () => {}) {
    this.add(route, "GET", callback);
  }
  put(route, callback = () => {}) {
    this.add(route, "PUT", callback);
  }
  delete(route, callback = () => {}) {
    this.add(route, "DELETE", callback);
  }
  async route(pathname, req, res , body) {
    const matchRoute = this.routes[pathname][req.method];
    if (
      !matchRoute ||
      typeof matchRoute !== "object" ||
      typeof matchRoute["callback"] !== "function"
    ) {
      throw "صفحه مورد نظر یافت نشد!";
    }

    if (req.method !== matchRoute["method"]) {
      throw "درخواست مورد نظر یافت نشد!";
    }

    const calledObject = new matchRoute["callback"](req, res);
    const calledMethod = this.detectMethod(req);
    // if is a valid route
    await calledObject[calledMethod](req , res);

  }

  detectMethod(request) {
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

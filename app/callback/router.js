const { helper, Xhelper } = require("../helper/functions");
const { RouteList } = require("../routes/routes");
const XResponse = require("./response");

class XRouter {
  routes = RouteList();

  addRoute(route, callback, params = []) {
    this.routes[route] = callback(params);
  }

  getRoutes() {
    return this.routes;
  }

  route(pathname, req, res) {
    let matchRoute;
    let routesList = Xhelper.findItemsByKeyValueInArray(
      this.routes,
      "path",
      pathname
    );

    if (routesList.length === 1) {
      matchRoute = routesList[0];
    } else {
      matchRoute = Xhelper.findItemsByKeyValueInArray(
        routesList,
        "method",
        req.method
      )[0];
    }

    if (!matchRoute || typeof matchRoute !== "object") {

      XResponse.send404(res);
      return;
    }

    if (typeof matchRoute["callback"] !== "function") {

      XResponse.send404(res);
      return;
    }
    if (req.method !== matchRoute["method"]) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Method does not match");

      return;
    }

    // if is a valid route
    matchRoute["callback"](req, res);
  }
}

module.exports = XRouter;

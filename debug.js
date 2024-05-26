const XRouter = require("./app/callback/router");

const r = new XRouter();

r.addRoute('/home' , () => {
    return 2
})

console.log(r.getRoutes());
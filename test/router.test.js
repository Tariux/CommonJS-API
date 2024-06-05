const { router } = require("../app/routes/routes");
const chai = require("chai");


describe("#routeList()", function () {
    it("checking all route's and controller job.", function (done) {
      const routes = router.getRoutes()
      chai.expect(typeof routes).be.equal('object')
      done()
    });
  });
  
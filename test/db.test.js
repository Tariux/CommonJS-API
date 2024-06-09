const chai = require("chai");
const {  employeDB, RedisManager } = require("../app/database/redis");

describe('RedisConnection()', function() {
    it('connect', async function(done) {
        const db = new RedisManager()
        const db1= db.client.duplicate({database:0})
        const db2= db.client.duplicate({database:1})
        console.log(await db2.set('meow_db_2' , 'xxxx'));
        console.log(await db1.set('meow_db_1' , 'xxxx'));
        chai.assert.equal(typeof db1 === 'object' , true)
        done()
    });

  });
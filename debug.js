const { createClient, createCluster } = require("redis");
const { RedisConeection } = require("./app/database/redis");

async function testRedis() {
async function test() {
  console.log(await conn.employeUniqueID());
  conn.selectDatabase(14)
  conn.client.set("this is for 1st db", "MEOW");

}
  const conn = new RedisConeection();


  conn.safeQuery(test)

}
testRedis();
// const fs = require("fs");

// function sendView(view , ext = 'html') {
//     let viewData = fs.readFileSync(`./app/components/${view}.${ext}`);

//     console.log('viewData' , viewData);
//     console.log('type viewData' , typeof viewData);
// }


// sendView('404222');

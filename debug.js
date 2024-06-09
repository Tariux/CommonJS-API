const { RedisConnection } = require("./app/database/redis");

async function settt() {
  //console.log(await  db.dbEmploye);
  console.log(await (await RedisConnection.parent).set('xxx' , 'yyy'));

}

settt()
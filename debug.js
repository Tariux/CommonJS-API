const { RedisConeection } = require("./app/database/redis");


async function testRedis() {
    const redis = new RedisConeection();

    let ttt = await redis.parent();
    console.log(typeof ttt);
    async function generateUserID(client) {
        const newUserID = await client.incr('user:id');
        return newUserID;
    
      }
      await generateUserID(ttt)
}

testRedis()
// const fs = require("fs");

// function sendView(view , ext = 'html') {
//     let viewData = fs.readFileSync(`./app/components/${view}.${ext}`);

//     console.log('viewData' , viewData);
//     console.log('type viewData' , typeof viewData);
// }

// sendView('404222');



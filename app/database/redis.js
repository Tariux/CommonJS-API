const { createClient } = require("redis");

class RedisConeection {

  connect(db) {
    try {
      // here we connect to a single conecction in default
      // Create a single Redis client
      const client = createClient({
        url: "redis://localhost:6379", // Replace with your Redis server URL
        db: 'db' + db
      });
      this.lastConnection = client;
      return client;
    } catch (error) {
      return false;
    }
  }
  async parent() {
    const parentClientDB = this.connect(1);
    this.parentClientDB = parentClientDB;
    return parentClientDB.connect()

  }
  async employe() {
    const employeClientDB = this.connect(0);
    this.employeClientDB = employeClientDB;
    return employeClientDB.connect()
  }

  async generateEmployeID(client) {
    const newUserID = await client.incr('employe:id');
    return newUserID;
  }
  async generateParentID(client) {
    const newUserID = await client.incr('parent:id');
    return newUserID;
  }
}


module.exports = { RedisConeection }
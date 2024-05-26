class RedisConeection {
  constructor(rootNodes) {
    this.rootNodes = rootNodes;
  }

  async connect() { // here we connect to a single conecction in default
    const client = createClient();

    client.on("error", (err) => console.log("Redis Client Error", err));

    const conn = await client.connect();



    return conn;
  }

  async cluster() {
    const cluster = createCluster({ // cluster connect to many databases
      rootNodes: [
        {
          url: "redis://127.0.0.1:16379",
        },
        {
          url: "redis://127.0.0.1:16380",
        },
        ...this.rootNodes, // more can be added here
        // ...
      ],
    });

    cluster.on("error", (err) => console.log("Redis Cluster Error", err));

    const conn = await cluster.connect();

    return conn;
  }
}

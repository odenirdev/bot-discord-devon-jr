const fastify = require("fastify");

function Server() {
  this.webApp = fastify({ logger: true });

  this.webApp.get("/health", async (request, reply) => {
    return reply.status(200).send("✅ Web Service is healthy");
  });

  this.start = async () => {
    try {
      await this.webApp.listen({ port: 1337 });

      console.log(
        `🔥 Web service is listening on ${this.webApp.server.address().port}`
      );
    } catch (err) {
      this.webApp.log.error(err);
      process.exit(1);
    }
  };
}

module.exports = Server;

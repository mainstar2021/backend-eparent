import { create, index, disable } from "@controllers/nurseryaccount";
import { FastifyPluginAsync } from "fastify";
import { createNurseryaccountSchema } from "schemas/nurseryaccount";

const root: FastifyPluginAsync = async (fastify, opts) => {
  // fastify.addHook("preHandler", fastify.authorize);
  fastify.post("/add", { preHandler: [fastify.authorize], schema: createNurseryaccountSchema }, create);
  fastify.post("/disable", { preHandler: [fastify.authorize] }, disable);
  fastify.get("/", { preHandler: [fastify.authorize] }, index);
};

export default root;
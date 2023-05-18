import { FastifyPluginAsync } from "fastify";
import { index, create, transactions } from "@controllers/finance";
import { createBillSchema } from "schemas/transaction"

const root: FastifyPluginAsync = async (fastify, opts) => {
  fastify.addHook("preHandler", fastify.authorize);

  fastify.get("/transactions", transactions);

  fastify.get("/", index);

  fastify.post("/add", { schema: createBillSchema }, create);
};

export default root;

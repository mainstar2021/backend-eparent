import { FastifyPluginAsync } from "fastify";
import { LoginSchema } from "schemas/admin";
import { login } from "@controllers/admin";

const root: FastifyPluginAsync = async (fastify, opts) => {
  // fastify.addHook("preHandler", fastify.authorize);
  fastify.post("/login", { schema: LoginSchema }, login);
};

export default root;
import { updateProfile, profile, changePassword } from "@controllers/user";
import { FastifyPluginAsync } from "fastify";
import { getProfileSchema, putProfileSchema } from "schemas/user";

const root: FastifyPluginAsync = async (fastify, opts) => {
  fastify.addHook("preHandler", fastify.authorize);

  fastify.get("/", { schema: getProfileSchema }, profile);
  fastify.put("/", { schema: putProfileSchema }, updateProfile);

  fastify.put("/password", changePassword);
};

export default root;

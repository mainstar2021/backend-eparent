import { login } from "@controllers/auth";
import { getChildren, getMe } from "@controllers/user";
import { FastifyPluginAsync } from "fastify";
import { index as getGallery } from "@controllers/gallery";
import { loginSchema } from "schemas/user";

const root: FastifyPluginAsync = async (fastify, opts) => {
  console.log('nursery')
  fastify.post("/login", { schema: loginSchema }, login);

  fastify.get("/children", { preHandler: [fastify.authorize] }, getChildren);

  fastify.get("/gallery", { preHandler: [fastify.authorize] }, getGallery);

  fastify.get("/me", { preHandler: [fastify.authorize] }, getMe);
  
};

export default root;

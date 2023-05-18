import { preValidationAsyncHookHandler } from "fastify";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const authorize: preValidationAsyncHookHandler = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
};

const authorization: FastifyPluginAsync = async (fastify, opts) => {
  fastify.decorate("authorize", authorize);
};

declare module "fastify" {
  interface FastifyInstance {
    authorize: preValidationAsyncHookHandler;
  }
}

export default fp(authorization, { name: "authorization" });

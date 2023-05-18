import { index, addClassroom, updateClassroom } from "@controllers/classrooms";
import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts) => {
  // fastify.addHook("preHandler", fastify.authorize);

  fastify.get("/", { preHandler: [fastify.authorize] }, index );

  fastify.post("/add", { preHandler: [fastify.authorize] }, addClassroom );

  fastify.post("/update", { preHandler: [fastify.authorize] }, updateClassroom );

};

export default root;
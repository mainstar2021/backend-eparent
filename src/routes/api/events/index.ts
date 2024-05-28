import { comment, create, createType, getComments, index, typesIndex, getNurseryEvents, getReportEvents, getIndicators } from "@controllers/event";
import { FastifyPluginAsync } from "fastify";
import { createEventSchema } from "schemas/event";

const events: FastifyPluginAsync = async (fastify, opts) => {
  fastify.addHook("preHandler", fastify.authorize);

  fastify.post("/types", createType);
  fastify.get("/types", typesIndex);
  fastify.get("/nursery", getNurseryEvents);
  fastify.get("/report", getReportEvents);
  fastify.get("/:eventId/comments", getComments);
  fastify.get("/:eventId/indicators", getIndicators);
  fastify.post("/:eventId/comments", comment);
  fastify.get("/", index);
  fastify.post("/", { preHandler: [fastify.authorize], schema: createEventSchema }, create);
};

export default events;

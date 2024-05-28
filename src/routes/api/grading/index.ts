import { getDevCategory, getDevMatter, saveIndicator, getCheckpoints, deleteDevMatter, updateDevMatter, addDevMatter, addCheckpoints, updateCheckpoints, deleteCheckpoints } from "@controllers/grading";
import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts) => {

  fastify.get("/dev_category", { preHandler: [fastify.authorize]}, getDevCategory);

  fastify.get("/dev_matter", { preHandler: [fastify.authorize]}, getDevMatter);
  fastify.post("/dev_matter/update", { preHandler: [fastify.authorize]}, updateDevMatter);
  fastify.post("/dev_matter/delete", { preHandler: [fastify.authorize]}, deleteDevMatter);
  fastify.put("/dev_matter/add", { preHandler: [fastify.authorize]}, addDevMatter);

  fastify.post("/save_indicator", {preHandler: [fastify.authorize]}, saveIndicator);

  fastify.get("/checkpoints", { preHandler: [fastify.authorize]}, getCheckpoints);
  fastify.put("/checkpoints/add", { preHandler: [fastify.authorize]}, addCheckpoints);
  fastify.post("/checkpoints/update", { preHandler: [fastify.authorize]}, updateCheckpoints);
  fastify.post("/checkpoints/delete", { preHandler: [fastify.authorize]}, deleteCheckpoints);
};

export default root;

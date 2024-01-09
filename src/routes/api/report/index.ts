import { addReport, getReports, downloadPDF } from "@controllers/report";
import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts) => {

  fastify.post("/add", { preHandler: [fastify.authorize] }, addReport);

  fastify.get("/", { preHandler: [fastify.authorize]}, getReports);
  
  fastify.get("/download", downloadPDF);

};

export default root;
import { getNewsletters, addNewsletterAdmin, updateNewsletter, deleteNewsletter } from "@controllers/newsletter";
import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts) => {

  fastify.post("/add/admin", { preHandler: [fastify.authorize] }, addNewsletterAdmin);

  fastify.get("/", { preHandler: [fastify.authorize]}, getNewsletters);

  fastify.post("/update", { preHandler: [fastify.authorize]}, updateNewsletter);

  fastify.post("/delete", { preHandler: [fastify.authorize] }, deleteNewsletter);

};

export default root;
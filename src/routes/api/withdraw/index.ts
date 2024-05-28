import { addWithdraw, getWithdraws, getAdminWithdraws, updateAdminWithdraw } from "@controllers/withdraw";
import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts) => {

  fastify.post("/add", { preHandler: [fastify.authorize] }, addWithdraw);

  fastify.get("/", { preHandler: [fastify.authorize]}, getWithdraws);

  fastify.get("/admin", { preHandler: [fastify.authorize] }, getAdminWithdraws );

  fastify.post("/update/master", { preHandler: [fastify.authorize] }, updateAdminWithdraw);

};

export default root;
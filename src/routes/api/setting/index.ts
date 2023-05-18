import { getSetting, updateNotificationSetting, updateSessionTimeout } from "@controllers/setting";
import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts) => {
  fastify.addHook("preHandler", fastify.authorize);

  fastify.get("/", getSetting);
  fastify.put("/notification", updateNotificationSetting);
  fastify.put("/session", updateSessionTimeout);
};

export default root;

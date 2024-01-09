import { addAttendance, deleteAttendance, getAttendances, updateAttendance } from "@controllers/attendance";
import { FastifyPluginAsync } from "fastify";
import { addAttendanceSchema } from "schemas/attendance";

const root: FastifyPluginAsync = async (fastify, opts) => {

  fastify.put("/add", { preHandler: [fastify.authorize], schema: addAttendanceSchema }, addAttendance);

  fastify.get("/", { preHandler: [fastify.authorize]}, getAttendances);

  fastify.post("/update", { preHandler: [fastify.authorize]}, updateAttendance);

  fastify.post("/delete", { preHandler: [fastify.authorize] }, deleteAttendance);

};

export default root;
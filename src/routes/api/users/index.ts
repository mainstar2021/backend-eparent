import { addChildren, getParent, updateParent, addChild, updateChild, getNursery, addUserasMaster, addUserasAdmin, updateParentPassword, deleteParent, updateNursery } from "@controllers/user";
import { FastifyPluginAsync } from "fastify";
import { addUserSchema, addChildSchema } from "schemas/user";

const root: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post("/:id/children", addChildren);

  fastify.post("/add/master", { preHandler: [fastify.authorize], schema: addUserSchema }, addUserasMaster);

  fastify.put("/add/admin", { preHandler: [fastify.authorize], schema: addUserSchema }, addUserasAdmin);

  fastify.get("/", { preHandler: [fastify.authorize]}, getParent);

  fastify.get("/nursery", { preHandler: [fastify.authorize]}, getNursery);

  fastify.put("/", { preHandler: [fastify.authorize]}, updateParent);

  fastify.put("/updateNursery", { preHandler: [fastify.authorize]}, updateNursery);

  fastify.post("/child", { preHandler: [fastify.authorize], schema: addChildSchema }, addChild);

  fastify.post("/update-password", { preHandler: [fastify.authorize] }, updateParentPassword);

  fastify.post("/delete", { preHandler: [fastify.authorize] }, deleteParent);

  fastify.put("/child", { preHandler: [fastify.authorize] }, updateChild);

};

export default root;

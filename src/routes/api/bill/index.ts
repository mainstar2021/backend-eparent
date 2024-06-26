import { create, getBills, getTransactions, getAdminBills, checkoutInvoice, checkoutParentInvoice } from "@controllers/bill";
import { FastifyPluginAsync } from "fastify";
import { createInvoiceSchema } from "schemas/bill";

const root: FastifyPluginAsync = async (fastify, opts) => {
  // fastify.addHook("preHandler", fastify.authorize);
  fastify.post("/add", { preHandler: [fastify.authorize], schema: createInvoiceSchema }, create);
  // fastify.get("/", { preHandler: [fastify.authorize] }, index);
  fastify.post("/checkout", { preHandler: [fastify.authorize]}, checkoutInvoice);

  fastify.post("/checkout-parent", { preHandler: [fastify.authorize]}, checkoutParentInvoice);

  fastify.get("/", { preHandler: [fastify.authorize] }, getBills );

  fastify.get("/admin", { preHandler: [fastify.authorize] }, getAdminBills );

  fastify.get("/transactions", { preHandler: [fastify.authorize] }, getTransactions )

};

export default root;
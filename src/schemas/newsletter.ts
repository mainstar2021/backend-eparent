import { FastifySchema } from "fastify";

export const addNewsletterSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      nursery_id: { type: "number" },
      year: { type: "string" },
      month: { type: "string" },
      content_resume: { type: "string" },
      content_movement: { type: "string" },
      content_birthday: { type: "string" },
      content_event: { type: "string" },
      content_msg: { type: "string" },
    },
  }
}

import { FastifySchema } from "fastify";

export const addAttendanceSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      childId: { type: "number" },
      start_date: { type: "string" },
      end_date: { type: "string" },
      reason: { type: "string" },
      comment: { type: "string" },
      type: { type: "number" },
      time: { type: "number" },
    },
  }
}
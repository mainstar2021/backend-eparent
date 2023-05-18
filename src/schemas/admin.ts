import { FastifySchema } from "fastify";

export const LoginSchema: FastifySchema = {
    body: {
        type: "object",
        properties: {
            email: { type: "string" },
            password: { type: "string" },
        },
    },

};


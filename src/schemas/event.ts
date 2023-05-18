import { fileSchema } from "./common";

export const createEventSchema = {
  body: {
    type: "object",
    properties: {
      childId: {
        type: "object",
        properties: {
          value: {
            type: "number",
          },
        },
      },
      infos: {
        type: "object",
        properties: {
          value: {
            type: "string",
          },
        },
      },
      eventType: {
        type: "object",
        properties: {
          value: {
            type: "number",
          },
        },
      },
      images: {
        oneOf: [fileSchema, { type: "array", items: fileSchema }],
      },
    },
  },
};


export const createNurseryaccountSchema = {
    body: {
        type: "object",
        properties: {
            name: { type: "string" },
            tax: { type: "string" },
            phone: { type: "string" },
        },
    },
};


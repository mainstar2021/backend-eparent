export const createInvoiceSchema = {
    body: {
        type: "object",
        properties: {
            heading: { type: "string" },
            type: { type: "string" },
            amount: { type: "number" },
            currency: { type: "string" },
            ref: {type: "string"},
            nurseryaccountId: {type: "number"}
        },
    },
};

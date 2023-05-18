export const createBillSchema = {
    body: {
        type: "object",
        properties: {
            heading: { type: "string" },
            type: { type: "string" },
            amount: { type: "number" },
            currency: { type: "string" },
            ref: {type: "string"},
            isCredit: {type: "boolean"},
            userId: {type: "number"}
        },
    },
};

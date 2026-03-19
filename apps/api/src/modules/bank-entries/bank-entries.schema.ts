const paymentSummarySchema = {
  type: ["object", "null"],
  required: ["id", "referenceMonth", "customer"],
  properties: {
    id: { type: "string" },
    referenceMonth: { type: "string" },
    customer: {
      type: "object",
      required: ["id", "fullName"],
      properties: {
        id: { type: "string" },
        fullName: { type: "string" }
      }
    }
  }
} as const;

const bankEntrySchema = {
  type: "object",
  required: [
    "id",
    "amount",
    "occurredAt",
    "description",
    "referenceCode",
    "source",
    "status",
    "payment",
    "createdAt",
    "updatedAt"
  ],
  properties: {
    id: { type: "string" },
    amount: { type: "number" },
    occurredAt: { type: "string" },
    description: { type: ["string", "null"] },
    referenceCode: { type: ["string", "null"] },
    source: { type: ["string", "null"] },
    status: { type: "string", enum: ["unmatched", "matched"] },
    payment: paymentSummarySchema,
    createdAt: { type: "string" },
    updatedAt: { type: "string" }
  }
} as const;

const errorSchema = {
  type: "object",
  required: ["error"],
  properties: {
    error: {
      type: "object",
      required: ["code", "message"],
      properties: {
        code: { type: "string" },
        message: { type: "string" }
      }
    }
  }
} as const;

export const createBankEntrySchema = {
  tags: ["Bank Entries"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["amount", "occurredAt"],
    additionalProperties: false,
    properties: {
      amount: { type: "number", exclusiveMinimum: 0 },
      occurredAt: { type: "string", format: "date-time" },
      description: { type: "string" },
      referenceCode: { type: "string" },
      source: { type: "string" }
    }
  },
  response: {
    201: {
      type: "object",
      required: ["data"],
      properties: {
        data: bankEntrySchema
      }
    },
    400: errorSchema,
    401: errorSchema
  }
} as const;

export const listBankEntriesSchema = {
  tags: ["Bank Entries"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "array",
          items: bankEntrySchema
        }
      }
    },
    401: errorSchema
  }
} as const;

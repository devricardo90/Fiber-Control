const paymentSchema = {
  type: "object",
  required: [
    "id",
    "customerId",
    "referenceMonth",
    "expectedAmount",
    "receivedAmount",
    "status",
    "paidAt",
    "notes",
    "customer",
    "createdAt",
    "updatedAt"
  ],
  properties: {
    id: { type: "string" },
    customerId: { type: "string" },
    referenceMonth: { type: "string" },
    expectedAmount: { type: "number" },
    receivedAmount: { type: "number" },
    status: { type: "string", enum: ["pending", "paid", "partial", "failed"] },
    paidAt: { type: ["string", "null"] },
    notes: { type: ["string", "null"] },
    customer: {
      type: "object",
      required: ["id", "fullName", "status"],
      properties: {
        id: { type: "string" },
        fullName: { type: "string" },
        status: {
          type: "string",
          enum: ["active", "due_today", "overdue", "suspended", "inactive"]
        }
      }
    },
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

export const createPaymentSchema = {
  tags: ["Payments"],
  body: {
    type: "object",
    required: ["customerId", "referenceMonth", "receivedAmount"],
    additionalProperties: false,
    properties: {
      customerId: { type: "string", minLength: 1 },
      referenceMonth: { type: "string", pattern: "^\\d{4}-(0[1-9]|1[0-2])$" },
      receivedAmount: { type: "number", minimum: 0 },
      paidAt: { type: "string", format: "date-time" },
      notes: { type: "string" }
    }
  },
  response: {
    201: {
      type: "object",
      required: ["data"],
      properties: {
        data: paymentSchema
      }
    },
    400: errorSchema,
    404: errorSchema,
    409: errorSchema
  }
} as const;

export const listPaymentsSchema = {
  tags: ["Payments"],
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "array",
          items: paymentSchema
        }
      }
    }
  }
} as const;

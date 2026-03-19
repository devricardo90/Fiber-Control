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

export const reconciliationMatchSchema = {
  tags: ["Reconciliation"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["bankEntryId", "paymentId"],
    additionalProperties: false,
    properties: {
      bankEntryId: { type: "string", minLength: 1 },
      paymentId: { type: "string", minLength: 1 }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "object",
          required: ["bankEntry", "payment"],
          properties: {
            bankEntry: {
              type: "object",
              required: ["id", "amount", "occurredAt", "status", "payment"],
              properties: {
                id: { type: "string" },
                amount: { type: "number" },
                occurredAt: { type: "string" },
                description: { type: ["string", "null"] },
                referenceCode: { type: ["string", "null"] },
                source: { type: ["string", "null"] },
                status: { type: "string", enum: ["matched"] },
                payment: {
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
                }
              }
            },
            payment: {
              type: "object",
              required: [
                "id",
                "customerId",
                "referenceMonth",
                "expectedAmount",
                "receivedAmount",
                "status",
                "paidAt"
              ],
              properties: {
                id: { type: "string" },
                customerId: { type: "string" },
                referenceMonth: { type: "string" },
                expectedAmount: { type: "number" },
                receivedAmount: { type: "number" },
                status: { type: "string", enum: ["pending", "partial", "paid", "failed"] },
                paidAt: { type: ["string", "null"] }
              }
            }
          }
        }
      }
    },
    400: errorSchema,
    401: errorSchema,
    404: errorSchema,
    409: errorSchema
  }
} as const;

export const reconciliationOverviewSchema = {
  tags: ["Reconciliation"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      referenceMonth: { type: "string", pattern: "^\\d{4}-(0[1-9]|1[0-2])$" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "object",
          required: ["referenceMonth", "summary", "unmatchedEntries", "missingPayments"],
          properties: {
            referenceMonth: { type: "string" },
            summary: {
              type: "object",
              required: [
                "matchedEntries",
                "unmatchedEntries",
                "missingPayments",
                "matchedAmount",
                "unmatchedAmount",
                "missingAmount"
              ],
              properties: {
                matchedEntries: { type: "integer" },
                unmatchedEntries: { type: "integer" },
                missingPayments: { type: "integer" },
                matchedAmount: { type: "number" },
                unmatchedAmount: { type: "number" },
                missingAmount: { type: "number" }
              }
            },
            unmatchedEntries: {
              type: "array",
              items: {
                type: "object",
                required: ["id", "amount", "occurredAt", "description", "referenceCode", "source"],
                properties: {
                  id: { type: "string" },
                  amount: { type: "number" },
                  occurredAt: { type: "string" },
                  description: { type: ["string", "null"] },
                  referenceCode: { type: ["string", "null"] },
                  source: { type: ["string", "null"] }
                }
              }
            },
            missingPayments: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "id",
                  "customerId",
                  "customerName",
                  "referenceMonth",
                  "expectedAmount",
                  "receivedAmount",
                  "outstandingAmount",
                  "status"
                ],
                properties: {
                  id: { type: "string" },
                  customerId: { type: "string" },
                  customerName: { type: "string" },
                  referenceMonth: { type: "string" },
                  expectedAmount: { type: "number" },
                  receivedAmount: { type: "number" },
                  outstandingAmount: { type: "number" },
                  status: { type: "string", enum: ["pending", "partial", "paid", "failed"] }
                }
              }
            }
          }
        }
      }
    },
    400: errorSchema,
    401: errorSchema
  }
} as const;

const alertSchema = {
  type: "object",
  required: ["type", "severity", "code", "message", "customer", "payment"],
  properties: {
    type: {
      type: "string",
      enum: ["overdue_customer", "cutoff_soon", "pending_payment"]
    },
    severity: {
      type: "string",
      enum: ["high", "medium", "low"]
    },
    code: { type: "string" },
    message: { type: "string" },
    daysLate: { type: "integer" },
    daysUntilCutoff: { type: "integer" },
    daysUntilDue: { type: "integer" },
    customer: {
      type: "object",
      required: ["id", "fullName", "status", "regionName"],
      properties: {
        id: { type: "string" },
        fullName: { type: "string" },
        status: {
          type: "string",
          enum: ["active", "due_today", "overdue", "suspended", "inactive"]
        },
        regionName: { type: ["string", "null"] }
      }
    },
    payment: {
      type: "object",
      required: ["referenceMonth", "expectedAmount", "receivedAmount", "outstandingAmount"],
      properties: {
        referenceMonth: { type: "string" },
        expectedAmount: { type: "number" },
        receivedAmount: { type: "number" },
        outstandingAmount: { type: "number" }
      }
    }
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

export const alertsOverviewSchema = {
  tags: ["Alerts"],
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      referenceDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "object",
          required: ["referenceDate", "referenceMonth", "summary", "alerts"],
          properties: {
            referenceDate: { type: "string" },
            referenceMonth: { type: "string" },
            summary: {
              type: "object",
              required: [
                "totalAlerts",
                "overdueCustomers",
                "customersReachingCutoff",
                "pendingPayments"
              ],
              properties: {
                totalAlerts: { type: "integer" },
                overdueCustomers: { type: "integer" },
                customersReachingCutoff: { type: "integer" },
                pendingPayments: { type: "integer" }
              }
            },
            alerts: {
              type: "array",
              items: alertSchema
            }
          }
        }
      }
    },
    400: errorSchema
  }
} as const;

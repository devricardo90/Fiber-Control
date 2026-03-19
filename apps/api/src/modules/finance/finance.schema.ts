const financeOverviewSchema = {
  type: "object",
  required: [
    "referenceMonth",
    "totalReceivedThisMonth",
    "totalReceivedThisYear",
    "totalReceivedLastYear",
    "expectedRevenueThisMonth",
    "overdueAmount",
    "outstandingAmount"
  ],
  properties: {
    referenceMonth: { type: "string" },
    totalReceivedThisMonth: { type: "number" },
    totalReceivedThisYear: { type: "number" },
    totalReceivedLastYear: { type: "number" },
    expectedRevenueThisMonth: { type: "number" },
    overdueAmount: { type: "number" },
    outstandingAmount: { type: "number" }
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

export const financeOverviewRouteSchema = {
  tags: ["Finance"],
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
        data: financeOverviewSchema
      }
    },
    400: errorSchema
  }
} as const;

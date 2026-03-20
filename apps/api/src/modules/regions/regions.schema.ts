const regionPerformanceItemSchema = {
  type: "object",
  required: [
    "regionId",
    "regionName",
    "regionCode",
    "referenceMonth",
    "customerCount",
    "activeCustomers",
    "overdueCustomers",
    "expectedAmount",
    "receivedAmount",
    "outstandingAmount",
    "collectionRate"
  ],
  properties: {
    regionId: { type: "string" },
    regionName: { type: "string" },
    regionCode: { type: ["string", "null"] },
    referenceMonth: { type: "string" },
    customerCount: { type: "integer" },
    activeCustomers: { type: "integer" },
    overdueCustomers: { type: "integer" },
    expectedAmount: { type: "number" },
    receivedAmount: { type: "number" },
    outstandingAmount: { type: "number" },
    collectionRate: { type: "number" }
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

export const regionsPerformanceSchema = {
  tags: ["Regions"],
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
          required: ["referenceMonth", "summary", "regions"],
          properties: {
            referenceMonth: { type: "string" },
            summary: {
              type: "object",
              required: [
                "totalRegions",
                "totalCustomers",
                "totalReceivedAmount",
                "totalExpectedAmount",
                "totalOutstandingAmount",
                "totalOverdueCustomers"
              ],
              properties: {
                totalRegions: { type: "integer" },
                totalCustomers: { type: "integer" },
                totalReceivedAmount: { type: "number" },
                totalExpectedAmount: { type: "number" },
                totalOutstandingAmount: { type: "number" },
                totalOverdueCustomers: { type: "integer" }
              }
            },
            regions: {
              type: "array",
              items: regionPerformanceItemSchema
            }
          }
        }
      }
    },
    400: errorSchema
  }
} as const;

export const listRegionsSchema = {
  tags: ["Regions"],
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "name"],
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              code: { type: ["string", "null"] }
            }
          }
        }
      }
    }
  }
} as const;

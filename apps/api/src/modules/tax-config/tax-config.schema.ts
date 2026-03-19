const taxConfigSchema = {
  type: "object",
  required: ["id", "regimeLabel", "estimatedRate", "dueDay", "createdAt", "updatedAt"],
  properties: {
    id: { type: "string" },
    regimeLabel: { type: "string" },
    estimatedRate: { type: "number" },
    dueDay: { type: "number" },
    notes: { type: ["string", "null"] },
    createdAt: { type: "string" },
    updatedAt: { type: "string" }
  }
} as const;

const taxEstimateSchema = {
  type: "object",
  required: [
    "referenceMonth",
    "regimeLabel",
    "estimatedRate",
    "dueDay",
    "grossRevenueThisMonth",
    "grossRevenueThisYear",
    "estimatedTaxThisMonth",
    "estimatedTaxThisYear"
  ],
  properties: {
    referenceMonth: { type: "string" },
    regimeLabel: { type: "string" },
    estimatedRate: { type: "number" },
    dueDay: { type: "number" },
    notes: { type: ["string", "null"] },
    grossRevenueThisMonth: { type: "number" },
    grossRevenueThisYear: { type: "number" },
    estimatedTaxThisMonth: { type: "number" },
    estimatedTaxThisYear: { type: "number" }
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

export const getTaxConfigSchema = {
  tags: ["Tax Config"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          anyOf: [taxConfigSchema, { type: "null" }]
        }
      }
    },
    401: errorSchema
  }
} as const;

export const upsertTaxConfigSchema = {
  tags: ["Tax Config"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["regimeLabel", "estimatedRate", "dueDay"],
    additionalProperties: false,
    properties: {
      regimeLabel: { type: "string", minLength: 1 },
      estimatedRate: { type: "number", exclusiveMinimum: 0, maximum: 100 },
      dueDay: { type: "integer", minimum: 1, maximum: 31 },
      notes: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: taxConfigSchema
      }
    },
    400: errorSchema,
    401: errorSchema
  }
} as const;

export const getTaxEstimateSchema = {
  tags: ["Tax Config"],
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
        data: taxEstimateSchema
      }
    },
    400: errorSchema,
    401: errorSchema,
    404: errorSchema
  }
} as const;

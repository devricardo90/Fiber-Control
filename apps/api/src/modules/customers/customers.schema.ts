const customerRegionSchema = {
  type: "object",
  required: ["id", "name", "code", "description"],
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    code: { type: ["string", "null"] },
    description: { type: ["string", "null"] }
  }
} as const;

const customerSchema = {
  type: "object",
  required: [
    "id",
    "fullName",
    "documentId",
    "phone",
    "email",
    "addressLine",
    "addressNumber",
    "neighborhood",
    "city",
    "state",
    "postalCode",
    "notes",
    "status",
    "monthlyFee",
    "dueDay",
    "graceDays",
    "cutoffDays",
    "serviceStartDate",
    "regionId",
    "region",
    "createdAt",
    "updatedAt"
  ],
  properties: {
    id: { type: "string" },
    fullName: { type: "string" },
    documentId: { type: ["string", "null"] },
    phone: { type: ["string", "null"] },
    email: { type: ["string", "null"] },
    addressLine: { type: ["string", "null"] },
    addressNumber: { type: ["string", "null"] },
    neighborhood: { type: ["string", "null"] },
    city: { type: ["string", "null"] },
    state: { type: ["string", "null"] },
    postalCode: { type: ["string", "null"] },
    notes: { type: ["string", "null"] },
    status: {
      type: "string",
      enum: ["active", "due_today", "overdue", "suspended", "inactive"]
    },
    monthlyFee: { type: "number" },
    dueDay: { type: "integer" },
    graceDays: { type: "integer" },
    cutoffDays: { type: "integer" },
    serviceStartDate: { type: ["string", "null"] },
    regionId: { type: ["string", "null"] },
    region: {
      anyOf: [{ type: "null" }, customerRegionSchema]
    },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    payments: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "referenceMonth", "expectedAmount", "receivedAmount", "status"],
        properties: {
          id: { type: "string" },
          referenceMonth: { type: "string" },
          expectedAmount: { type: "number" },
          receivedAmount: { type: "number" },
          status: { type: "string" },
          paidAt: { type: ["string", "null"] },
          notes: { type: ["string", "null"] }
        }
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

export const createCustomerSchema = {
  tags: ["Customers"],
  body: {
    type: "object",
    required: ["fullName", "monthlyFee", "dueDay"],
    additionalProperties: false,
    properties: {
      fullName: { type: "string", minLength: 1 },
      documentId: { type: "string", minLength: 1 },
      phone: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
      addressLine: { type: "string", minLength: 1 },
      addressNumber: { type: "string", minLength: 1 },
      neighborhood: { type: "string", minLength: 1 },
      city: { type: "string", minLength: 1 },
      state: { type: "string", minLength: 1, maxLength: 2 },
      postalCode: { type: "string", minLength: 1 },
      notes: { type: "string" },
      monthlyFee: { type: "number", exclusiveMinimum: 0 },
      dueDay: { type: "integer", minimum: 1, maximum: 31 },
      graceDays: { type: "integer", minimum: 0, default: 0 },
      cutoffDays: { type: "integer", minimum: 0, default: 0 },
      serviceStartDate: { type: "string", format: "date" },
      regionId: { type: "string", minLength: 1 }
    }
  },
  response: {
    201: {
      type: "object",
      required: ["data"],
      properties: {
        data: customerSchema
      }
    },
    400: errorSchema,
    404: errorSchema,
    409: errorSchema
  }
} as const;

export const listCustomersSchema = {
  tags: ["Customers"],
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "array",
          items: customerSchema
        }
      }
    }
  }
} as const;

export const getCustomerByIdSchema = {
  tags: ["Customers"],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: customerSchema
      }
    },
    404: errorSchema
  }
} as const;

export const updateCustomerSchema = {
  tags: ["Customers"],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 }
    }
  },
  body: {
    type: "object",
    additionalProperties: false,
    properties: {
      fullName: { type: "string", minLength: 1 },
      documentId: { type: "string", minLength: 1 },
      phone: { type: "string", minLength: 1 },
      addressLine: { type: "string", minLength: 1 },
      addressNumber: { type: "string", minLength: 1 },
      neighborhood: { type: "string", minLength: 1 },
      city: { type: "string", minLength: 1 },
      state: { type: "string", minLength: 1, maxLength: 2 },
      postalCode: { type: "string", minLength: 1 },
      monthlyFee: { type: "number", exclusiveMinimum: 0 },
      dueDay: { type: "integer", minimum: 1, maximum: 31 },
      graceDays: { type: "integer", minimum: 0 },
      cutoffDays: { type: "integer", minimum: 0 },
      regionId: { type: "string", minLength: 1 }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: customerSchema
      }
    },
    400: errorSchema,
    404: errorSchema,
    409: errorSchema
  }
} as const;

export const recalculateCustomerStatusSchema = {
  tags: ["Customers"],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 }
    }
  },
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
        data: customerSchema
      }
    },
    400: errorSchema,
    404: errorSchema
  }
} as const;

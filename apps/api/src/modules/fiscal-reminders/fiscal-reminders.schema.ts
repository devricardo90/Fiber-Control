const reminderSchema = {
  type: "object",
  required: [
    "id",
    "title",
    "dueDate",
    "reminderDate",
    "severity",
    "status",
    "resolvedAt",
    "createdAt",
    "updatedAt"
  ],
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: ["string", "null"] },
    dueDate: { type: "string" },
    reminderDate: { type: "string" },
    severity: { type: "string", enum: ["low", "medium", "high"] },
    status: { type: "string", enum: ["upcoming", "due_today", "overdue", "resolved"] },
    resolvedAt: { type: ["string", "null"] },
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

export const createFiscalReminderSchema = {
  tags: ["Fiscal Reminders"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["title", "dueDate", "reminderDate", "severity"],
    additionalProperties: false,
    properties: {
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      dueDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      reminderDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      severity: { type: "string", enum: ["low", "medium", "high"] }
    }
  },
  response: {
    201: {
      type: "object",
      required: ["data"],
      properties: {
        data: reminderSchema
      }
    },
    400: errorSchema,
    401: errorSchema
  }
} as const;

export const listFiscalRemindersSchema = {
  tags: ["Fiscal Reminders"],
  security: [{ bearerAuth: [] }],
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
          type: "array",
          items: reminderSchema
        }
      }
    },
    400: errorSchema,
    401: errorSchema
  }
} as const;

export const updateFiscalReminderSchema = {
  tags: ["Fiscal Reminders"],
  security: [{ bearerAuth: [] }],
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
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      dueDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      reminderDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      severity: { type: "string", enum: ["low", "medium", "high"] },
      resolved: { type: "boolean" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: reminderSchema
      }
    },
    400: errorSchema,
    401: errorSchema,
    404: errorSchema
  }
} as const;

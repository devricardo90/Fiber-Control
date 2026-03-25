const userSchema = {
  type: "object",
  required: ["id", "fullName", "email", "role", "isActive", "createdAt", "updatedAt"],
  properties: {
    id: { type: "string" },
    fullName: { type: "string" },
    email: { type: "string" },
    role: { type: "string", enum: ["admin", "operator"] },
    isActive: { type: "boolean" },
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
        message: { type: "string" },
        details: { type: "object" }
      }
    },
    statusCode: { type: "number" },
    requestId: { type: "string" },
    path: { type: "string" },
    timestamp: { type: "string" }
  }
} as const;

const authResponseSchema = {
  type: "object",
  required: ["data"],
  properties: {
    data: {
      type: "object",
      required: ["user", "accessToken", "expiresAt"],
      properties: {
        user: userSchema,
        accessToken: { type: "string" },
        expiresAt: { type: "string", format: "date-time" }
      }
    }
  }
} as const;

export const registerSchema = {
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["fullName", "email", "password"],
    additionalProperties: false,
    properties: {
      fullName: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 }
    }
  },
  response: {
    201: authResponseSchema,
    400: errorSchema,
    409: errorSchema
  }
} as const;

export const loginSchema = {
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 }
    }
  },
  response: {
    200: authResponseSchema,
    400: errorSchema,
    401: errorSchema
  }
} as const;

export const meSchema = {
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: userSchema
      }
    },
    401: errorSchema
  }
} as const;

export const listUsersSchema = {
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "array",
          items: userSchema
        }
      }
    },
    401: errorSchema,
    403: errorSchema
  }
} as const;

export const updateUserSchema = {
  tags: ["Auth"],
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
      fullName: { type: "string", minLength: 1 },
      role: { type: "string", enum: ["admin", "operator"] },
      isActive: { type: "boolean" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: userSchema
      }
    },
    400: errorSchema,
    401: errorSchema,
    403: errorSchema,
    404: errorSchema
  }
} as const;

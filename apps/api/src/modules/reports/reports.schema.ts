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

export const monthlyRevenueReportSchema = {
  tags: ["Reports"],
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
          required: ["referenceMonth", "summary", "payments"],
          properties: {
            referenceMonth: { type: "string" },
            summary: {
              type: "object",
              required: ["totalPayments", "expectedAmount", "receivedAmount", "outstandingAmount"],
              properties: {
                totalPayments: { type: "integer" },
                expectedAmount: { type: "number" },
                receivedAmount: { type: "number" },
                outstandingAmount: { type: "number" }
              }
            },
            payments: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "id",
                  "customerId",
                  "customerName",
                  "regionName",
                  "expectedAmount",
                  "receivedAmount",
                  "outstandingAmount",
                  "status"
                ],
                properties: {
                  id: { type: "string" },
                  customerId: { type: "string" },
                  customerName: { type: "string" },
                  regionName: { type: ["string", "null"] },
                  expectedAmount: { type: "number" },
                  receivedAmount: { type: "number" },
                  outstandingAmount: { type: "number" },
                  status: { type: "string", enum: ["pending", "paid", "partial", "failed"] }
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

export const annualSummaryReportSchema = {
  tags: ["Reports"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      year: { type: "string", pattern: "^\\d{4}$" }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "object",
          required: ["year", "summary", "monthlyBreakdown"],
          properties: {
            year: { type: "integer" },
            summary: {
              type: "object",
              required: [
                "totalPayments",
                "totalExpectedAmount",
                "totalReceivedAmount",
                "totalOutstandingAmount"
              ],
              properties: {
                totalPayments: { type: "integer" },
                totalExpectedAmount: { type: "number" },
                totalReceivedAmount: { type: "number" },
                totalOutstandingAmount: { type: "number" }
              }
            },
            monthlyBreakdown: {
              type: "array",
              items: {
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
          }
        }
      }
    },
    400: errorSchema,
    401: errorSchema
  }
} as const;

export const overdueReportSchema = {
  tags: ["Reports"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "object",
          required: ["summary", "customers"],
          properties: {
            summary: {
              type: "object",
              required: [
                "totalCustomers",
                "overdueCustomers",
                "suspendedCustomers",
                "totalOutstandingAmount"
              ],
              properties: {
                totalCustomers: { type: "integer" },
                overdueCustomers: { type: "integer" },
                suspendedCustomers: { type: "integer" },
                totalOutstandingAmount: { type: "number" }
              }
            },
            customers: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "id",
                  "fullName",
                  "status",
                  "regionName",
                  "monthlyFee",
                  "outstandingAmount",
                  "latestReferenceMonth"
                ],
                properties: {
                  id: { type: "string" },
                  fullName: { type: "string" },
                  status: { type: "string", enum: ["overdue", "suspended"] },
                  regionName: { type: ["string", "null"] },
                  monthlyFee: { type: "number" },
                  outstandingAmount: { type: "number" },
                  latestReferenceMonth: { type: ["string", "null"] }
                }
              }
            }
          }
        }
      }
    },
    401: errorSchema
  }
} as const;

export const regionReportSchema = {
  tags: ["Reports"],
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
          required: ["referenceMonth", "regions"],
          properties: {
            referenceMonth: { type: "string" },
            regions: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "regionId",
                  "regionName",
                  "customerCount",
                  "expectedAmount",
                  "receivedAmount",
                  "outstandingAmount"
                ],
                properties: {
                  regionId: { type: "string" },
                  regionName: { type: "string" },
                  customerCount: { type: "integer" },
                  expectedAmount: { type: "number" },
                  receivedAmount: { type: "number" },
                  outstandingAmount: { type: "number" }
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

export const customerDetailReportSchema = {
  tags: ["Reports"],
  security: [{ bearerAuth: [] }],
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
        data: {
          type: "object",
          required: [
            "id",
            "fullName",
            "status",
            "regionName",
            "serviceStartDate",
            "monthlyFee",
            "totalPaidAmount",
            "totalOutstandingAmount",
            "payments"
          ],
          properties: {
            id: { type: "string" },
            fullName: { type: "string" },
            status: {
              type: "string",
              enum: ["active", "due_today", "overdue", "suspended", "inactive"]
            },
            regionName: { type: ["string", "null"] },
            serviceStartDate: { type: ["string", "null"] },
            monthlyFee: { type: "number" },
            totalPaidAmount: { type: "number" },
            totalOutstandingAmount: { type: "number" },
            payments: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "id",
                  "referenceMonth",
                  "expectedAmount",
                  "receivedAmount",
                  "outstandingAmount",
                  "status",
                  "paidAt"
                ],
                properties: {
                  id: { type: "string" },
                  referenceMonth: { type: "string" },
                  expectedAmount: { type: "number" },
                  receivedAmount: { type: "number" },
                  outstandingAmount: { type: "number" },
                  status: { type: "string", enum: ["pending", "paid", "partial", "failed"] },
                  paidAt: { type: ["string", "null"] }
                }
              }
            }
          }
        }
      }
    },
    401: errorSchema,
    404: errorSchema
  }
} as const;

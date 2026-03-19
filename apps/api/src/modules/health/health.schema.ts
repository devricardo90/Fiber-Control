export const healthSchema = {
  tags: ["Health"],
  response: {
    200: {
      type: "object",
      required: ["data"],
      properties: {
        data: {
          type: "object",
          required: ["status", "service", "timestamp"],
          properties: {
            status: { type: "string" },
            service: { type: "string" },
            timestamp: { type: "string" }
          }
        }
      }
    }
  }
};

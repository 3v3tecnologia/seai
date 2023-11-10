export const DEFAULT_RESPONSES = {
  500: {
    description: "Internal error",
    content: {
      "application/json": {
        schema: {
          type: "object",
          items: {
            type: "object",
            properties: {
              error: {
                type: "string",
              },
            },
          },
          example: {
            error: "Internal server error",
          },
        },
      },
    },
  },
  403: {
    description: "Forbidden access",
    content: {
      "application/json": {
        schema: {
          type: "object",
          items: {
            type: "object",
            properties: {
              error: {
                type: "string",
              },
            },
          },
          example: {
            error: "Forbidden access",
          },
        },
      },
    },
  },
  401: {
    description: "No authorization",
    content: {
      "application/json": {
        schema: {
          type: "object",
          items: {
            type: "object",
            properties: {
              error: {
                type: "string",
              },
            },
          },
          example: {
            error: "No authorization",
          },
        },
      },
    },
  },
};

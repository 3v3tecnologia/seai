import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["Api Access key"];

export const API_KEY = {
  [`${BASE_URL.V1}/accessKey`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get apy key by id",
      parameters: [
        {
          name: "API key id",
          in: "query",
          description: "Api key id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      properties: {
                        Id: "number",
                        Key: "string",
                        Type: "string",
                        Enabled: "boolean",
                        CreatedAt: "string",
                        UpdatedAt: "string",
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Id: 1,
                    Key: "askdjh1jk2317sadgj1gsd123ee2324654",
                    Type: "Bearer",
                    Enabled: false,
                    CreatedAt: "2024-01-26T11:32:40.399Z",
                    UpdatedAt: "2024-01-26T11:32:40.399Z",
                  },
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Create API_KEY",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                Enabled: {
                  type: "boolean",
                },
              },
              example: {
                Key: "asdasd23412sdg42re5d1613241",
                Type: "Bearer",
                Enabled: false,
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Key created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                        },
                        id: {
                          type: "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    message: "Sucesso ao criar chave de acesso.",
                    id: 4,
                  },
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    put: {
      tags: TAGS,
      summary: "Update API key",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "API key id",
          in: "query",
          description: "Api key id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                Enabled: {
                  type: "boolean",
                },
              },
              example: {
                Key: "asdasd23412sdg42re5d1613241",
                Type: "Bearer",
                Enabled: false,
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Equipment updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "string",
                    },
                  },
                },
                example: {
                  data: "Sucesso ao atualizar chave de acesso",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
};

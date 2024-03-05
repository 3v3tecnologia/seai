import { BASE_URL } from "../commons/baseURL";
import { DEFAULT_RESPONSES } from "../commons/status";
import { BEARER_AUTH } from "../commons/security";

const TAGS = ["Meteorological Organ"];

export const METEOROLOGICAL_ORGAN = {
  [`${BASE_URL.V1}/equipments/organ`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get all meteorological organs",
      responses: {
        200: {
          description: "Meteorological organ list",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          Id: "number",
                          Name: "number",
                          Host: "string",
                          User: "string",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Id: 1,
                      Name: "FUNCEME",
                      Host: "funceme",
                      User: "x",
                    },
                  ],
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
      summary: "Create meteorological organ",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                Host: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Password: {
                  type: "string",
                },
                User: {
                  type: "string",
                },
              },
              example: {
                Host: "test1.test",
                Name: "Test1",
                Password: "1234",
                User: "root",
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Organ created successfully",
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
                  data: "Sucesso ao criar órgão 4.",
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
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Organ Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      summary: "Update meteorological organ by id",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                Host: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Password: {
                  type: "string",
                },
                User: {
                  type: "string",
                },
              },
              example: {
                Host: "test1.test",
                Name: "Test1",
                Password: "1234",
                User: "root",
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Meteorological Organ updated successfully",
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
                  data: "Sucesso ao atualizar orgão x.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    delete: {
      tags: TAGS,
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Organ Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      summary: "Delete Organ",
      responses: {
        200: {
          description: "Meteorological Organ deleted successfully",
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
                  data: "Sucesso ao deletar órgão 4.",
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

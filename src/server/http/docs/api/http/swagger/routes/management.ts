import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["Management"];

export const MANAGEMENT = {
  [`${BASE_URL.V1}/management/crop`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "Get all crops",
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      id: 3,
                      name: "ALFACE",
                      locationName: "FORTALEZA",
                    },
                    {
                      id: 4,
                      name: "FEIJÃO",
                      locationName: "FORTALEZA",
                    },
                    {
                      id: 2,
                      name: "LIMÃO",
                      locationName: "FORTALEZA",
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
      summary: "Create crop",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                name: "FEIJÃO",
                locationName: "FORTALEZA",
                cycles: [
                  {
                    stage: 1,
                    title: "test",
                    durationInDays: 12,
                    KC: 54,
                  },
                ],
              },
            },
          },
        },
      },
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
                      type: "string",
                    },
                  },
                },
                example: {
                  data: "Sucesso ao criar cultura 4.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/management/crop/{id}`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get crop by id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Id crop",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Daily stations measures",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    id: 3,
                    name: "ALFACE",
                    locationName: "FORTALEZA",
                    cycles: [
                      {
                        title: "test",
                        durationInDays: 12,
                        KC: 54,
                      },
                      {
                        title: "test",
                        durationInDays: 12,
                        KC: 54,
                      },
                      {
                        title: "test",
                        durationInDays: 12,
                        KC: 54,
                      },
                    ],
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
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Crop Id",
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
              example: {
                name: "LIMÃO",
                locationName: "ESTADOS",
                cycles: [
                  {
                    stage: 1,
                    title: "test",
                    durationInDays: 12,
                    KC: 54,
                  },
                ],
              },
            },
          },
        },
      },
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
                      type: "string",
                    },
                  },
                },
                example: {
                  data: "Sucesso ao atualizar cultura  5.",
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
          description: "Crop Id",
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
                      type: "string",
                    },
                  },
                },
                example: {
                  data: "Sucesso ao deletar cultura  5.",
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

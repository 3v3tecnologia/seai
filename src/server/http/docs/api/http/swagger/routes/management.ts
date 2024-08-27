import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";
import {
  UserOperationExample,
  UserOperationSchema,
} from "../commons/user-operation";

const TAGS = ["Management"];

export const MANAGEMENT = {
  [`${BASE_URL.V2}/management/crop`]: {
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
                Name: "Cultura Teste",
                IsPermanent: true,
                Cycles: [
                  {
                    Title: "Ciclo 1",
                    Start: 1,
                    End: 3,
                    KC: 54,
                    Increment: 0
                  },
                  {
                    Title: "Ciclo 2",
                    Start: 4,
                    End: 5,
                    KC: 54,
                    Increment: 0
                  }
                ]
              }
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
                  data: 1,
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V2}/management/crop/cycles/{id}`]: {
    get: {
      tags: TAGS,
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Crop id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Get crop cycles",
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      Id: 1,
                      Title: "Ciclo 1",
                      Start: 1,
                      End: 3,
                      KC: 54,
                      Increment: 0,
                    },
                    {
                      Id: 2,
                      Title: "Ciclo 2",
                      Start: 1,
                      End: 3,
                      KC: 54,
                      Increment: 0,
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
  },
  [`${BASE_URL.V2}/management/crop/{id}`]: {
    get: {
      tags: TAGS,
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
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    Id: 16,
                    Name: "Cultura Teste",
                    IsPermanent: true,
                    Cycles: [
                      {
                        Id: 10,
                        Title: "Ciclo 1",
                        Start: 1,
                        End: 3,
                        KC: 54,
                        Increment: 0
                      },
                      {
                        Id: 11,
                        Title: "Ciclo 2",
                        Start: 4,
                        End: 5,
                        KC: 54,
                        Increment: 0
                      }
                    ],
                    CycleRestartPoint: 10
                  }
                }
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
                Name: "Cultura Teste",
                IsPermanent: true,
                Cycles: [
                  {
                    Title: "Ciclo 1",
                    Start: 1,
                    End: 3,
                    KC: 54,
                    Increment: 0
                  },
                  {
                    Title: "Ciclo 2",
                    Start: 4,
                    End: 5,
                    KC: 54,
                    Increment: 0
                  }
                ],
                ...UserOperationExample,
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
                  data: "Sucesso ao atualizar cultura.",
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
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                ...UserOperationSchema,
              },
              example: {
                ...UserOperationExample,
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
                  data: "Sucesso ao deletar cultura.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V2}/management/crop/{id}/cycle/restart-point`]: {
    patch: {
      tags: TAGS,
      security: [BEARER_AUTH],
      description: "Sets the restart point when creating or updating a crop",
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
                CycleRestartPoint: 4,
                ...UserOperationExample,
              },
            },
          },
        },
      },
      responses: {
        204: {
          content: {},
        },
        ...DEFAULT_RESPONSES,
      },
    }
  },
};

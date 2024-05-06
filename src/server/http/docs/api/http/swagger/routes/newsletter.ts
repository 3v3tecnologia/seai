import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";
import { BASE_URL } from "../commons/baseURL";

const TAGS = ["News"];

const URL = `${BASE_URL.V1}/news`;

export const NEWSLETTER = {
  [`${URL}`]: {
    get: {
      tags: TAGS,
      summary: "Get all news",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "title",
          in: "query",
          required: false,
          description: "News title",
          schema: {
            type: "string"
          },
        },
        {
          name: "pageNumber",
          in: "query",
          description: "Pagination number. Default 1",
          required: false,
          schema: {
            type: "number",
          },
        },
        {
          name: "limit",
          in: "query",
          description: "Data limit",
          required: false,
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
                      Data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            Id: "number",
                            Author: {
                              type: "object",
                              properties: {
                                Id: "number",
                                Email: "string",
                                Organ: "string",
                              },
                            },
                            Title: "string",
                            Description: "string",
                            CreatedAt: "string",
                            UpdatedAt: "string",
                          },
                        },
                      },
                      Pagination: {
                        type: "object",
                        properties: {
                          PageLimitRows: "number",
                          PageNumber: "number",
                          QtdRows: "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Items: [
                      {
                        Id: 2,
                        Author: {
                          Id: 1,
                          Email: "test@gmail.com",
                          Organ: "Funceme"
                        },
                        Title: "Test",
                        Description: "Test",
                        CreatedAt: "2024-04-30T14:37:34.297Z",
                        UpdatedAt: "2024-04-30T14:37:34.297Z"
                      }
                    ],
                    TotalItems: 1,
                    Page: 1,
                    PageSize: 40,
                    TotalPages: 1
                  }
                }
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
      summary: "Create news",
      description: "SendDate is Unix Timestamp",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                FK_Author: "number",
                Title: "string",
                Description: "string",
                SendDate: "string",
                Data: "string",
              },
              example: {
                FK_Author: 1,
                Title: "TESTINHO",
                Description: "Testinho",
                Data: "data:text/html;charset=utf-8;base64,CiAgICA8aDE+M1YzIFVSTDwvaDE+CiAgICA8YSBocmVmPWh0dHA6Ly9zb2Z0d2FyZS4zdjMuZmFybT5WaXNpdGUgYSBzb2Z0d2FyZTwvYT4K",
                SendDate: 1702951200065,
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
                  data: "Notícia criada com sucessso.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${URL}/{id}`]: {
    get: {
      tags: TAGS,
      summary: "Get news by ID",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "News Id",
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
                      Data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            Id: "number",
                            Author: {
                              type: "object",
                              properties: {
                                Id: "number",
                                Email: "string",
                                Organ: "string",
                              },
                            },
                            Title: "string",
                            Data: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  type: "string",
                                  data: {
                                    type: "array",
                                    items: {
                                      type: "number",
                                    },
                                  },
                                },
                              },
                            },
                            Description: "string",
                            CreatedAt: "string",
                            UpdatedAt: "string",
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Id: 4,
                    Author: {
                      Id: 1,
                      Email: "testSender@gmail.com",
                      Organ: "FUNCEME",
                    },
                    Title: "TESTINHO",
                    Description: "Testinho",
                    CreatedAt: "2023-12-12T11:24:24.600Z",
                    UpdatedAt: "2023-12-12T11:24:24.600Z",
                    Data: {
                      type: "Buffer",
                      data: [
                        100, 97, 116, 97, 58, 116, 101, 120, 116, 47, 104, 116,
                        109, 108, 59, 99, 104, 97, 114, 115, 101, 116, 61, 117,
                        116, 102, 45, 56, 59, 98, 97, 115, 101, 54, 52, 44, 67,
                        105, 65, 103, 73, 67, 65, 56, 97, 68, 69, 43, 77, 49,
                        89, 122, 73, 70, 86, 83, 84, 68, 119, 118, 97, 68, 69,
                        43, 67, 105, 65, 103, 73, 67, 65, 56, 89, 83, 66, 111,
                        99, 109, 86, 109, 80, 87, 104, 48, 100, 72, 65, 54, 76,
                        121, 57, 122, 98, 50, 90, 48, 100, 50, 70, 121, 90, 83,
                        52, 122, 100, 106, 77, 117, 90, 109, 70, 121, 98, 84,
                        53, 87, 97, 88, 78, 112, 100, 71, 85, 103, 89, 83, 66,
                        122, 98, 50, 90, 48, 100, 50, 70, 121, 90, 84, 119, 118,
                        89, 84, 52, 75,
                      ],
                    },
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
      summary: "Update Newsletter by id",
      description: "SendDate is Unix Timestamp",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "News Id",
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
                FK_Author: "number",
                Title: "string",
                Description: "string",
                SendDate: "string",
                Data: "string",
              },
              example: {
                FK_Author: 1,
                Title: "TESTINHO",
                Description: "Testinho",
                Data: "data:text/html;charset=utf-8;base64,CiAgICA8aDE+M1YzIFVSTDwvaDE+CiAgICA8YSBocmVmPWh0dHA6Ly9zb2Z0d2FyZS4zdjMuZmFybT5WaXNpdGUgYSBzb2Z0d2FyZTwvYT4K",
                SendDate: 1702951200065,
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
                  data: "Sucesso ao atualizar notícia",
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
      summary: "Delete news",
      description: "Delete news by id",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "News Id",
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
                  data: "Notícia deletada com sucessso.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${URL}/subscribers`]: {
    get: {
      tags: TAGS,
      summary: "Get newsletter subscribers",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "email",
          in: "query",
          description: "Email",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "name",
          in: "query",
          description: "Name",
          required: false,
          schema: {
            type: "string",
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
                    Items: [
                      {
                        Id: 1,
                        Email: "tester@gmail.com",
                        Name: "Tester",
                        CreatedAt: "2024-04-30T16:11:16.522Z",
                        UpdatedAt: "2024-04-30T16:11:16.522Z"
                      }
                    ],
                    TotalItems: 1,
                    Page: 1,
                    PageSize: 40,
                    TotalPages: 1
                  }
                }
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${URL}/enroll`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Create news",
      description: "SendDate is Unix Timestamp",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                Email: "string",
                Name: "string",
              },
              example: {
                Email: "tester2@gmail.com",
                Name: "Tester",
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
                  data: "Usuário inscrito com sucesso na lista de emails",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${URL}/unregister`]: {
    delete: {
      tags: TAGS,
      summary: "Delete news",
      description: "Delete news by id",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "email",
          in: "path",
          description: "Subscriber email",
          required: true,
          schema: {
            type: "string",
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
                  data: "Usuário deletado com sucesso da lista de emails",
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

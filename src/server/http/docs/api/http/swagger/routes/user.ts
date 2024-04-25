import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["User"];

export const USER = {
  [`${BASE_URL.V1}/user/list`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get users",
      description: "Get users",
      parameters: [
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
        {
          name: "type",
          in: "query",
          description: "User type",
          required: false,
          schema: {
            type: "string",
            enum: ["admin", "standard"],
          },
        },
        {
          name: "name",
          in: "query",
          description:
            "Textual filter by equipment name or code or location name",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Get users successfully",
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
                          id: {
                            type: "number",
                          },
                          name: {
                            type: "string",
                          },
                          login: {
                            type: "string",
                          },
                          email: {
                            type: "string",
                          },
                          type: {
                            type: "string",
                          },
                          createdAt: {
                            type: "string",
                          },
                          updatedAt: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Items: [
                      {
                        id: 1,
                        name: "admin",
                        login: "admin",
                        email: "admin@gmail.com",
                        type: "admin",
                        createdAt:
                          "Wed Jun 28 2023 11:23:10 GMT+0000 (Coordinated Universal Time)",
                        updatedAt:
                          "Wed Jun 28 2023 11:23:10 GMT+0000 (Coordinated Universal Time)",
                      },
                    ],
                    TotalItems: 1,
                    PageSize: 1,
                    TotalPages: 1,
                  },
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/user`]: {
    put: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Update user",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "User Id",
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
                email: {
                  type: "string",
                },
                modules: {
                  type: "object",
                  properties: {
                    news: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        read: {
                          type: "boolean",
                        },
                        write: {
                          type: "boolean",
                        },
                      },
                    },
                    register: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        read: {
                          type: "boolean",
                        },
                        write: {
                          type: "boolean",
                        },
                      },
                    },
                    user: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        read: {
                          type: "boolean",
                        },
                        write: {
                          type: "boolean",
                        },
                      },
                    },
                  },
                },
                type: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
                confirmPassword: {
                  type: "string",
                },
                login: {
                  type: "string",
                },
              },
              example: {
                email: "d@test.com",
                modules: {
                  news: {
                    id: 1,
                    read: true,
                    write: true
                  },
                  user: {
                    id: 2,
                    read: false,
                    write: false
                  },
                  register: {
                    id: 3,
                    read: true,
                    write: true
                  },
                  jobs: {
                    id: 4,
                    read: true,
                    write: true
                  }
                },
                type: "admin",
                name: "tester",
                password: "1234567",
                login: "tester",
                confirmPassword: "1234567",
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User created successfully",
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
                  data: "Usuário tester atualizado com sucesso.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/complete-register`]: {
    patch: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Update user",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "User Id",
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
                name: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
                confirmPassword: {
                  type: "string",
                },
                login: {
                  type: "string",
                },
              },
              example: {
                name: "tester",
                login: "tester",
                password: "1234567",
                confirmPassword: "1234567",
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User created successfully",
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
                  data: "Usuário tester atualizado com sucesso.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/user/profile`]: {
    patch: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Update user profile",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                login: {
                  type: "string",
                },
              },
              example: {
                email: "test@gmail.com",
                name: "tester",
                login: "tester",
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User updated successfully",
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
                  data: "Usuário tester atualizado com sucesso.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get user profile",
      description: "Get user profile",
      responses: {
        200: {
          description: "Get users successfully",
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
                        id: {
                          type: "number",
                        },
                        name: {
                          type: "string",
                        },
                        login: {
                          type: "string",
                        },
                        email: {
                          type: "string",
                        },
                        type: {
                          type: "string",
                        },
                        createdAt: {
                          type: "string",
                        },
                        updatedAt: {
                          type: "string",
                        },
                        modules: {
                          news: {
                            id: 1,
                            read: true,
                            write: true
                          },
                          user: {
                            id: 2,
                            read: false,
                            write: false
                          },
                          register: {
                            id: 3,
                            read: true,
                            write: true
                          },
                          jobs: {
                            id: 4,
                            read: true,
                            write: true
                          }
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      id: 1,
                      name: "test",
                      login: "test",
                      email: "test2@gmail.com",
                      type: "standard",
                      createdAt: "2023-06-29T21:06:44.887Z",
                      updatedAt: "2023-06-29T21:06:44.887Z",
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
  [`${BASE_URL.V1}/user/delete`]: {
    delete: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Delete user account by  id or email",
      description: "Delete user account by or email",
      parameters: [
        {
          name: "id",
          in: "query",
          description: "User Id",
          required: false,
          schema: {
            type: "number",
          },
        },
        {
          name: "name",
          in: "query",
          description: "User name",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "User deleted",
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
                  data: "Usuário deletado com sucesso",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/user/register`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Create user account by admin",
      description:
        "In case of creating a new user account, should send email to user",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                modules: {
                  type: "object",
                  properties: {
                    news: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        read: {
                          type: "boolean",
                        },
                        write: {
                          type: "boolean",
                        },
                      },
                    },
                    register: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        read: {
                          type: "boolean",
                        },
                        write: {
                          type: "boolean",
                        },
                      },
                    },
                    user: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        read: {
                          type: "boolean",
                        },
                        write: {
                          type: "boolean",
                        },
                      },
                    },
                    jobs: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        read: {
                          type: "boolean",
                        },
                        write: {
                          type: "boolean",
                        },
                      },
                    },
                  },
                },
              },
              example: {
                email: "test@gmail.com",
                type: "standard",
                modules: {
                  news: {
                    id: 1,
                    read: true,
                    write: true
                  },
                  user: {
                    id: 2,
                    read: false,
                    write: false
                  },
                  register: {
                    id: 3,
                    read: true,
                    write: true
                  },
                  jobs: {
                    id: 4,
                    read: true,
                    write: true
                  }
                }
              }
            },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
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
                  data: "Sucesso ao criar usuário, email enviado com sucesso para test@gmail.com",
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

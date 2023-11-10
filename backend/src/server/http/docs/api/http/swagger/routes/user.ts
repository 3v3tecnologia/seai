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
                email: "davispenha12@gmail.com",
                modules: {
                  news: {
                    id: 1,
                    read: false,
                    write: false,
                  },
                  register: {
                    id: 2,
                    read: false,
                    write: true,
                  },
                  user: {
                    id: 3,
                    read: true,
                    write: false,
                  },
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
  [`${BASE_URL.V1}/user/profile`]: {
    put: {
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
                email: "test@gmail.com",
                modules: {
                  news: {
                    id: 1,
                    read: false,
                    write: false,
                  },
                  register: {
                    id: 2,
                    read: false,
                    write: true,
                  },
                  user: {
                    id: 3,
                    read: true,
                    write: false,
                  },
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
                            write: true,
                          },
                          user: {
                            id: 2,
                            read: true,
                            write: true,
                          },
                          register: {
                            id: 3,
                            read: true,
                            write: true,
                          },
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
      summary: "Delete user account by  id",
      description: "Delete user account by id",
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
                    write: true,
                  },
                  register: {
                    id: 2,
                    read: true,
                    write: true,
                  },
                  user: {
                    id: 3,
                    read: true,
                    write: true,
                  },
                },
              },
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

import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["User", "Irrigation System"];

const URL = `${BASE_URL.V1}/user`;

export const USER_IRRIGANT = {
  [`${URL}/irrigant`]: {
    post: {
      tags: TAGS,
      summary: "Create a new user irrigant",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                login: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
                confirmPassword: {
                  type: "string",
                },
              },
              example: {
                name: "tester",
                login: "tester",
                email: "tester",
                password: "1234567",
                confirmPassword: "1234567",
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
                  data: {
                    accessToken: "token",
                    userName: "irrigant",
                  },
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
      summary: "Delete user account",
      responses: {
        204: {},
        ...DEFAULT_RESPONSES,
      },
    },
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
                  required: false,
                },
                name: {
                  type: "string",
                  required: true,
                },
                login: {
                  type: "string",
                  required: true,
                },
                password: {
                  type: "string",
                  required: true,
                },
                confirmPassword: {
                  type: "string",
                  required: true,
                },
              },
              example: {
                email: "test@gmail.com",
                name: "tester",
                login: "tester",
                password: "test",
                confirmPassword: "test",
              },
            },
          },
        },
      },
      responses: {
        204: {
          description: "User updated successfully",
          content: {},
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
                        status: {
                          type: "string",
                        },
                        code: {
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
                example: {
                  data: {
                    id: 1,
                    name: "super-admin",
                    login: "super-admin",
                    code: "c431ab3e43c5dc6f2c57",
                    status: "registered",
                    email: "test@gmail.com",
                    type: "admin",
                    createdAt: "2023-06-28T11:23:10.437Z",
                    updatedAt: "2024-05-17T17:52:58.699Z",
                    module: {
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
                      jobs: {
                        id: 4,
                        read: true,
                        write: true,
                      },
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
  },
  [`${URL}/irrigant/login`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "User login",
      description: "User Irrigant login",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
              example: {
                login: "irrigant_test",
                password: "123456",
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successfully",
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
                        accessToken: {
                          type: "string",
                        },
                        userName: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    accessToken: "token",
                    userName: "admin",
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
  [`${URL}/irrigant/reset-password/{code}`]: {
    patch: {
      tags: TAGS,
      summary: "Reset user password",
      parameters: [
        {
          name: "code",
          in: "path",
          description: "User base64 code",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                password: {
                  type: "string",
                },
                confirmPassword: {
                  type: "string",
                },
              },
              example: {
                password: "1234",
                confirmPassword: "1234",
              },
            },
          },
        },
      },
      responses: {
        204: {},
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${URL}/irrigant/forgot-password`]: {
    post: {
      tags: TAGS,
      summary: "Send an email to the user for reset the password",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  description: "a valid email",
                  required: true,
                },
              },
              example: {
                email: "teste@gmail.com",
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
                  data: "Um email para rescuperação de senha será enviado em breve.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${URL}/irrigant/activate/{code}`]: {
    patch: {
      tags: TAGS,
      parameters: [
        {
          name: "code",
          in: "path",
          description: "User base64 code",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      summary: "Complete user account registration",
      responses: {
        204: {},
        ...DEFAULT_RESPONSES,
      },
    },
  },
};

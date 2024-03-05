import { DEFAULT_RESPONSES } from "../commons/status";
import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";

const TAGS = ["Login"];

export const LOGIN = {
  [`${BASE_URL.V1}/login/sign-in`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "User login",
      description: "User login",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                login: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
              example: {
                login: "admin",
                password: "1234567",
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
  [`${BASE_URL.V1}/login/sign-up`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Complete register account",
      description: "Complete register account",
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
                password: {
                  type: "string",
                },
                confirmPassword: {
                  type: "string",
                },
              },
              example: {
                email: "admin@gmail.com",
                name: "admin",
                login: "admin",
                password: "1234567",
                confirmPassword: "1234567",
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Register account successfully",
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
                      },
                    },
                  },
                },
                example: {
                  data: {
                    accessToken: "token",
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
  [`${BASE_URL.V1}/login/password/forgot`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Sendo forgot password email",
      description: "Send forgot password email",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
              },
              example: {
                email: "admin@gmail.com",
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Email sended successfully",
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
                  data: "Email de recuperação de senha enviado com sucesso para test@gmail.com",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/login/password/reset`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Change user password",
      description: "Change user password",
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
                password: "123456789",
                confirmPassword: "123456789",
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Password changed successfully",
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
                  data: "Senha resetada com sucesso",
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

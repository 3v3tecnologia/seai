import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";
import {
  UserOperationExample,
  UserOperationSchema,
} from "../commons/user-operation";

const TAGS = ["User"];

const URL = `${BASE_URL.V1}/user`;

export const USER = {
  [`${URL}/system/modules`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get system modules",
      description: "Get all system modules names",
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
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      id: 1,
                      name: "user",
                    },
                    {
                      id: 2,
                      name: "weights",
                    },
                    {
                      id: 3,
                      name: "faq",
                    },
                    {
                      id: 4,
                      name: "crop",
                    },
                    {
                      id: 5,
                      name: "equipments",
                    },
                    {
                      id: 6,
                      name: "newsletter",
                    },
                    {
                      id: 7,
                      name: "business_analysis",
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
  [`${URL}/`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get all users",
      description:
        "Get all users when the user authenticated has authorization",
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
        {
          name: "status",
          in: "query",
          description:
            "Textual filter by user status",
          required: false,
          schema: {
            type: "string",
            enum: ["registered", "pending"],
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
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Create user account and invite user to complete registration",
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
                    weights: {
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
                    faq: {
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
                    crop: {
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
                    equipments: {
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
                    newsletter: {
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
                    business_analysis: {
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
                  user: {
                    id: 1,
                    read: false,
                    write: false,
                  },
                  weights: {
                    id: 2,
                    read: true,
                    write: true,
                  },
                  faq: {
                    id: 3,
                    read: true,
                    write: true,
                  },
                  crop: {
                    id: 4,
                    read: true,
                    write: true,
                  },
                  equipments: {
                    id: 5,
                    read: true,
                    write: true,
                  },
                  newsletter: {
                    id: 6,
                    read: true,
                    write: true,
                  },
                  business_analysis: {
                    id: 7,
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
                  data: "Usuário criado com sucessso, aguardando confirmação do cadastro.",
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
      summary: "Delete user account by email",
      parameters: [
        {
          name: "email",
          in: "query",
          description: "User email",
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
  [`${URL}/{id}`]: {
    patch: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Update a user",
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
                    weights: {
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
                    faq: {
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
                    crop: {
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
                    equipments: {
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
                    newsletter: {
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
                    business_analysis: {
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
                ...UserOperationSchema,
              },
              example: {
                type: "admin",
                email: "teste@gmail.com",
                login: "tester",
                name: "tester",
                modules: {
                  user: {
                    id: 1,
                    read: true,
                    write: true,
                  },
                  weights: {
                    id: 2,
                    read: true,
                    write: true,
                  },
                  faq: {
                    id: 3,
                    read: true,
                    write: true,
                  },
                  crop: {
                    id: 4,
                    read: true,
                    write: true,
                  },
                  equipments: {
                    id: 5,
                    read: true,
                    write: true,
                  },
                  newsletter: {
                    id: 6,
                    read: true,
                    write: true,
                  },
                  business_analysis: {
                    id: 7,
                    read: true,
                    write: true,
                  },
                },
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
                  data: "Usuário  atualizado com sucesso.",
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
      summary: "Delete user account by id",
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
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get user by id",
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
                        modules: {
                          user: {
                            id: 1,
                            read: false,
                            write: false,
                          },
                          weights: {
                            id: 2,
                            read: true,
                            write: true,
                          },
                          faq: {
                            id: 3,
                            read: true,
                            write: true,
                          },
                          crop: {
                            id: 4,
                            read: true,
                            write: true,
                          },
                          equipments: {
                            id: 5,
                            read: true,
                            write: true,
                          },
                          newsletter: {
                            id: 6,
                            read: false,
                            write: true,
                          },
                          business_analysis: {
                            id: 7,
                            read: false,
                            write: true,
                          },
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
                    modules: {
                      user: {
                        id: 1,
                        read: false,
                        write: false,
                      },
                      weights: {
                        id: 2,
                        read: true,
                        write: true,
                      },
                      faq: {
                        id: 3,
                        read: true,
                        write: true,
                      },
                      crop: {
                        id: 4,
                        read: true,
                        write: true,
                      },
                      equipments: {
                        id: 5,
                        read: true,
                        write: true,
                      },
                      newsletter: {
                        id: 6,
                        read: false,
                        write: true,
                      },
                      business_analysis: {
                        id: 7,
                        read: false,
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
  [`${URL}/password/reset/{code}`]: {
    post: {
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
                  data: "Senha resetada com sucesso.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${URL}/password/forgot`]: {
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
  [`${URL}/sign-in`]: {
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
                type: {
                  type: "string",
                  enum: ["government", "irrigant"],
                }
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
  [`${URL}/complete-registration/{code}`]: {
    patch: {
      tags: TAGS,
      summary: "Update user",
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
                ...UserOperationSchema,
              },
              example: {
                name: "tester",
                login: "tester",
                password: "1234567",
                confirmPassword: "1234567",
                ...UserOperationExample,
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
                  data: "Sucesso ao completar cadastro de usuário",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${URL}/profile`]: {
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
                ...UserOperationSchema,
              },
              example: {
                email: "test@gmail.com",
                name: "tester",
                login: "tester",
                ...UserOperationExample,
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
                        modules: {
                          user: {
                            id: 1,
                            read: false,
                            write: false,
                          },
                          weights: {
                            id: 2,
                            read: true,
                            write: true,
                          },
                          faq: {
                            id: 3,
                            read: true,
                            write: true,
                          },
                          crop: {
                            id: 4,
                            read: true,
                            write: true,
                          },
                          equipments: {
                            id: 5,
                            read: true,
                            write: true,
                          },
                          newsletter: {
                            id: 6,
                            read: false,
                            write: true,
                          },
                          business_analysis: {
                            id: 7,
                            read: false,
                            write: true,
                          },
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
                      user: {
                        id: 1,
                        read: false,
                        write: false,
                      },
                      weights: {
                        id: 2,
                        read: true,
                        write: true,
                      },
                      faq: {
                        id: 3,
                        read: true,
                        write: true,
                      },
                      crop: {
                        id: 4,
                        read: true,
                        write: true,
                      },
                      equipments: {
                        id: 5,
                        read: true,
                        write: true,
                      },
                      newsletter: {
                        id: 6,
                        read: false,
                        write: true,
                      },
                      business_analysis: {
                        id: 7,
                        read: false,
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
    delete: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Delete user account profile",
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
};

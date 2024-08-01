import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";
import { BASE_URL } from "../commons/baseURL";

const TAGS = ["Logs"];

export const USER_OPERATIONS_LOGS = {
  [`${BASE_URL.V1}/logs`]: {
    get: {
      tags: TAGS,
      summary: "Get Equipment measurement logs",
      security: [BEARER_AUTH],
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
          name: "user_id",
          in: "query",
          required: false,
          schema: {
            type: "number",
          },
        },
        {
          name: "resource",
          in: "query",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "operation",
          in: "query",
          description: "user operation",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Logs",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                },
                example: {
                  data: {
                    Items: [
                      {
                        time: "2024-07-31T22:23:46.449Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "Criação de notícia",
                        operation: "create",
                        resource: "newsletter",
                      },
                      {
                        time: "2024-07-31T22:26:10.011Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "Criação de notícia",
                        operation: "create",
                        resource: "newsletter",
                      },
                      {
                        time: "2024-07-31T22:27:01.766Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "Criação de notícia",
                        operation: "create",
                        resource: "newsletter",
                      },
                      {
                        time: "2024-07-31T22:50:23.799Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "Criação de notícia",
                        operation: "create",
                        resource: "newsletter",
                      },
                      {
                        time: "2024-07-31T22:53:13.445Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "testando descrição",
                        operation: "update",
                        resource: "newsletter",
                      },
                      {
                        time: "2024-07-31T22:54:35.721Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "testando descrição",
                        operation: "delete",
                        resource: "newsletter",
                      },
                      {
                        time: "2024-07-31T22:54:50.907Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "testando descrição",
                        operation: "delete",
                        resource: "newsletter",
                      },
                      {
                        time: "2024-07-31T22:59:04.535Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "Criação de usuário",
                        operation: "create",
                        resource: "user",
                      },
                      {
                        time: "2024-07-31T23:00:13.335Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "testando deleção usuário",
                        operation: "delete",
                        resource: "user",
                      },
                      {
                        time: "2024-08-01T15:12:52.422Z",
                        user: {
                          id: 3,
                          name: "super-admin",
                        },
                        description: "Criação de usuário",
                        operation: "create",
                        resource: "user",
                      },
                    ],
                    TotalItems: 30,
                    Page: 1,
                    PageSize: 10,
                    TotalPages: 3,
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
};

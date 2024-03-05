import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";
import { BASE_URL } from "../commons/baseURL";

const TAGS = ["Logs"];

export const SYSTEM_LOGS = {
  [`${BASE_URL.V1}/equipments/logs/{id}`]: {
    get: {
      tags: TAGS,
      summary: "Get Equipment measurement logs",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Equipment Id",
          required: true,
          schema: {
            type: "number",
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
        {
          name: "start",
          in: "query",
          description: "Start date YYYY-MM-DD",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "end",
          in: "query",
          description: "End date YYYY-MM-DD",
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
                  properties: {
                    data: {
                      type: "object",
                      Logs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            Time: "string",
                            Status: "number",
                            Operation: "string",
                            Message: "string",
                          },
                        },
                      },
                      PageNumber: {
                        type: "number",
                      },
                      QtdRows: {
                        type: "number",
                      },
                      PageLimitRows: {
                        type: "number",
                      },
                      QtdPages: {
                        type: "number",
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Logs: [
                      {
                        Time: "2023-11-16T17:56:09.683Z",
                        Status: "warning",
                        Operation: "Equipments measures",
                        Message:
                          "Não foi possível obter dados de medições do equipamento test1234 do dia 2023-11-15, salvando dados sem medições.",
                      },
                    ],
                    PageNumber: 0,
                    QtdRows: 1,
                    PageLimitRows: 90,
                    QtdPages: 1,
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

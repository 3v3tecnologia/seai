import { DEFAULT_RESPONSES } from "./../../commons/status";
import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";

export const CULTURES = {
  [`${BASE_URL.V1}/census/cultures`]: {
    get: {
      tags: ["Census"],
      summary: "Get crop indicators by basin",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Id basin",
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
                        Id: "string",
                        Cultures: {
                          type: "object",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Id: 1,
                    Cultures: {
                      "Cana de açúcar ": {
                        Social: 0,
                        Consumption: 3000,
                        Economic: 99,
                        Productivity: 0,
                      },
                      "Capim elefante": {
                        Social: 0,
                        Consumption: 3000,
                        Economic: 99,
                        Productivity: 0,
                      },
                      "Capim Forrageiro": {
                        Social: 0,
                        Consumption: 0,
                        Economic: 153000,
                        Productivity: 0,
                      },
                      "SORGO FORRAGEIRO": {
                        Social: 0,
                        Consumption: 0,
                        Economic: 38.333333333333336,
                        Productivity: 0,
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
  },
};

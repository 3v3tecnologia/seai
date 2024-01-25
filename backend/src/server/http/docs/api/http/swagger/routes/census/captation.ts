import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "./../../commons/status";
import { BASE_URL } from "../../commons/baseURL";

export const CAPTATION = {
  [`${BASE_URL.V1}/census/captation/county`]: {
    get: {
      tags: ["Census"],
      summary: "Get all captations by county",
      description: "List Flow and Volume Average",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "List all data per month",
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
                          Bacia: "string",
                          Municipio: "string",
                          Mes: "number",
                          Captação: "number",
                          "Vazão média": "number",
                          "Volume médio": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Alto Jaguaribe",
                      Municipio: "Acopiara",
                      Mes: "Junho",
                      Captação: "Subterrânea",
                      "Vazão média": 14,
                      "Volume médio": 2520,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      Municipio: "Acopiara",
                      Mes: "Julho",
                      Captação: "Subterrânea",
                      "Vazão média": 14,
                      "Volume médio": 2589.26,
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
  [`${BASE_URL.V1}/census/captation/basin`]: {
    get: {
      tags: ["Census"],
      summary: "Get all captations by basin",
      description: "List Flow and Volume Average",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "List all data per month",
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
                          Bacia: "string",
                          Mes: "string",
                          Captação: "string",
                          Tanques: "number",
                          "Volume/tanques": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Alto Jaguaribe",
                      Municipio: "Acopiara",
                      Mes: "Junho",
                      Captação: "Subterrânea",
                      "Vazão média": 14,
                      "Volume médio": 2520,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      Municipio: "Acopiara",
                      Mes: "Julho",
                      Captação: "Subterrânea",
                      "Vazão média": 14,
                      "Volume médio": 2589.26,
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
};

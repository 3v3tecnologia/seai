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
                      Municipio: "Araripe",
                      Mes: "Dezembro",
                      Captação: null,
                      "Vazão média": 10.22,
                      "Volume médio": 2426.67,
                    },
                    {
                      Municipio: "Saboeiro",
                      Mes: "Julho",
                      Captação: null,
                      "Vazão média": 3.67,
                      "Volume médio": 130,
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
                      Mes: "Janeiro",
                      Captação: "Subterrânea",
                      "Vazão média": 17.01,
                      "Volume médio": 1728.4,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      Mes: "Janeiro",
                      Captação: "Superficial",
                      "Vazão média": 21.21,
                      "Volume médio": 2003.39,
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

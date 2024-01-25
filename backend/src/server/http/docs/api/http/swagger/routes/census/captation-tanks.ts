import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "./../../commons/status";
import { BASE_URL } from "../../commons/baseURL";

export const CAPTATION_TANK = {
  [`${BASE_URL.V1}/census/captation/tank/county`]: {
    get: {
      tags: ["Census"],
      summary: "Get all tanks captations by county",
      description: "List all data per month",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "",
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
                          Bacia: "string",
                          Mes: "string",
                          Captação: "string",
                          Tanques: "number",
                          "Volume/tanque": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Municipio: "Itaiçaba",
                      Bacia: "Baixo Jaguaribe",
                      Mes: "Fevereiro",
                      Captação: "Superficial",
                      Tanques: 166,
                      "Volume/tanque": 218.25,
                    },
                    {
                      Municipio: "Alto Santo",
                      Bacia: "Médio Jaguaribe",
                      Mes: "Abril",
                      Captação: "Subterrânea",
                      Tanques: 1,
                      "Volume/tanque": 450,
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
  [`${BASE_URL.V1}census/captation/tank/basin`]: {
    get: {
      tags: ["Census"],
      summary: "Get all tanks captations by basin",
      description: "List all data per month",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "All security economic indicator by county",
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
                      Bacia: "Médio Jaguaribe",
                      Mes: "Maio",
                      Captação: null,
                      Tanques: 43,
                      "Volume/tanque": 288.28,
                    },
                    {
                      Bacia: "Médio Jaguaribe",
                      Mes: "Dezembro",
                      Captação: null,
                      Tanques: 43,
                      "Volume/tanque": 1959.07,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      Mes: "Fevereiro",
                      Captação: null,
                      Tanques: 249,
                      "Volume/tanque": 161.83,
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

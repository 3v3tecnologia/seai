import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "./../../commons/status";
import { BASE_URL } from "../../commons/baseURL";

export const SECURITY_WATER = {
  [`${BASE_URL.V1}/census/indicator/security/water/basin`]: {
    get: {
      tags: ["Census"],
      summary: "Get all census takers by county",
      description: "Get census takers by county",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "Get all census takers by county",
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
                          ConsumoTotal: "number",
                          AreaIrrigadaTotal: "number",
                          "m³/ha": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Alto Jaguaribe",
                      ConsumoTotal: 20437072,
                      AreaIrrigadaTotal: 2417.294,
                      "m³/ha": 8454.525,
                    },
                    {
                      Bacia: "Baixo Jaguaribe",
                      ConsumoTotal: 96903890,
                      AreaIrrigadaTotal: 22695.6,
                      "m³/ha": 4269.721,
                    },
                    {
                      Bacia: "Médio Jaguaribe",
                      ConsumoTotal: 15773000,
                      AreaIrrigadaTotal: 1306.4788,
                      "m³/ha": 12072.909,
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
  [`${BASE_URL.V1}/census/indicator/security/water/county`]: {
    get: {
      tags: ["Census"],
      summary: "Get all security water indicator by county",
      description: "Get all security water indicator by county",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "All security water indicator by county",
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
                          ConsumoTotal: "number",
                          AreaIrrigadaTotal: "number",
                          "m³/ha": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Nome: "Acopiara",
                      Tipo: "municipio",
                      Bacia: "Alto Jaguaribe",
                      ConsumoTotal: {
                        unidade: "m³",
                        valor: 297696,
                      },
                      AreaIrrigadaTotal: {
                        unidade: "ha",
                        valor: 15.799999,
                      },
                      VolumePorArea: 18841.52,
                    },
                    {
                      Nome: "Aiuaba",
                      Tipo: "municipio",
                      Bacia: "Alto Jaguaribe",
                      ConsumoTotal: {
                        unidade: "m³",
                        valor: 113569,
                      },
                      AreaIrrigadaTotal: {
                        unidade: "ha",
                        valor: 35.1,
                      },
                      VolumePorArea: 3235.5842,
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

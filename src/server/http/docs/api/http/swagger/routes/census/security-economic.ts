import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "../../commons/status";

export const SECURITY_ECONOMIC = {
  [`${BASE_URL.V1}/census/indicator/security/economic/basin`]: {
    get: {
      tags: ["Census"],
      summary: "Get all security economic indicator by basin",
      description: "Get all security economic indicator by basin",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "All security economic indicator by coubasinnty",
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
                          AreaIrrigada: "number",
                          Rentabilidade: "number",
                          "R$/ha": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Alto Jaguaribe",
                      AreaIrrigada: 2111.49,
                      Rentabilidade: 45488400,
                      "R$/ha": 21543.3,
                    },
                    {
                      Bacia: "Baixo Jaguaribe",
                      AreaIrrigada: 7838.55,
                      Rentabilidade: 148190000,
                      "R$/ha": 18905.2,
                    },
                    {
                      Bacia: "Médio Jaguaribe",
                      AreaIrrigada: 1127,
                      Rentabilidade: 8696980,
                      "R$/ha": 7716.93,
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
  [`${BASE_URL.V1}/census/indicator/security/economic/county`]: {
    get: {
      tags: ["Census"],
      summary: "Get all security economic indicator by county",
      description: "Get all security economic indicator by county",
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
                          Municipio: "string",
                          AreaIrrigada: "number",
                          ha: "number",
                          "R$/ha": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Tipo: "municipio",
                      Nome: "Nova Olinda",
                      Bacia: "Alto Jaguaribe",
                      AreaIrrigada: {
                        unidade: "ha",
                        valor: 22.6,
                      },
                      Rentabilidade: {
                        unidade: "R$",
                        valor: 1600520,
                      },
                      RentabilidadePorArea: 70819.2,
                    },
                    {
                      Tipo: "municipio",
                      Nome: "Jucás",
                      Bacia: "Alto Jaguaribe",
                      AreaIrrigada: {
                        unidade: "ha",
                        valor: 262.8,
                      },
                      Rentabilidade: {
                        unidade: "R$",
                        valor: 13143100,
                      },
                      RentabilidadePorArea: 50011.6,
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

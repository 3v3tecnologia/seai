import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "../../commons/status";

export const WORKERS = {
  [`${BASE_URL.V1}/census/workers/county`]: {
    get: {
      tags: ["Census"],
      summary: "Get all workers by county",
      description: "Get all workers by county",
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
                          Municipio: "string",
                          Tipo: "number",
                          "Média de trabalhadores": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Alto Jaguaribe",
                      Municipio: "Potengi",
                      Tipo: "Pessoa Física",
                      "Média de trabalhadores": 0,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      Municipio: "Tarrafas",
                      Tipo: "Pessoa Física",
                      "Média de trabalhadores": 0,
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
  [`${BASE_URL.V1}/census/workers/basin`]: {
    get: {
      tags: ["Census"],
      summary: "Get all workers by basin",
      description: "Get all workers by basin",
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
                          Bacia: "string",
                          Tipo: "number",
                          "Média de trabalhadores": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Alto Jaguaribe",
                      Tipo: "Pessoa Física",
                      "Média de trabalhadores": 0,
                    },
                    {
                      Bacia: "Médio Jaguaribe",
                      Tipo: "Pessoa Jurídica",
                      "Média de trabalhadores": 0,
                    },
                    {
                      Bacia: "Médio Jaguaribe",
                      Tipo: "Pessoa Física",
                      "Média de trabalhadores": 0,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      Tipo: "Pessoa Jurídica",
                      "Média de trabalhadores": 0,
                    },
                    {
                      Bacia: "Baixo Jaguaribe",
                      Tipo: "Pessoa Física",
                      "Média de trabalhadores": 0,
                    },
                    {
                      Bacia: "Baixo Jaguaribe",
                      Tipo: "Pessoa Jurídica",
                      "Média de trabalhadores": 13.52,
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

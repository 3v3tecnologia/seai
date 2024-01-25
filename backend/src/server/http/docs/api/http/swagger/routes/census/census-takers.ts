import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "./../../commons/status";

export const CENSUS_TAKERS = {
  [`${BASE_URL.V1}/census/census-takers/basin`]: {
    get: {
      tags: ["Census"],
      summary: "Get all census takers by basin",
      description: "Get census takers by basin",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "Get all census takers by basin",
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
                          Quantidade: "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Baixo Jaguaribe",
                      Quantidade: 1261,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      Quantidade: 1209,
                    },
                    {
                      Bacia: "Médio Jaguaribe",
                      Quantidade: 441,
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
  [`${BASE_URL.V1}/census/census-takers/county`]: {
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
                          Municipio: "string",
                          Quantidade: "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Baixo Jaguaribe",
                      Municipio: "Limoeiro do Norte",
                      Quantidade: 389,
                    },
                    {
                      Bacia: "Baixo Jaguaribe",
                      Municipio: "Russas",
                      Quantidade: 378,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      Municipio: "Iguatu",
                      Quantidade: 230,
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

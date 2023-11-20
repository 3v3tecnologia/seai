import { DEFAULT_RESPONSES } from "./../../commons/status";
import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";

export const AQUACULTURE = {
  [`${BASE_URL.V1}/census/aquaculture/basin`]: {
    get: {
      tags: ["Census"],
      summary: "Get aquaculture by basin",
      description: "Get aquaculture by basin",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "Get all aquaculture by basin",
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
                          Tanques: "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Baixo Jaguaribe",
                      Tanques: 1363,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      Tanques: 249,
                    },
                    {
                      Bacia: "Médio Jaguaribe",
                      Tanques: 43,
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
  [`${BASE_URL.V1}/census/aquaculture/county`]: {
    get: {
      tags: ["Census"],
      summary: "Get aquaculture by county",
      description: "Get aquaculture by county",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "Get all aquaculture by county",
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
                          Tanques: "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Municipio: "Jaguaruana",
                      Tanques: 562,
                    },
                    {
                      Municipio: "Aracati",
                      Tanques: 390,
                    },
                    {
                      Municipio: "Orós",
                      Tanques: 239,
                    },
                    {
                      Municipio: "Russas",
                      Tanques: 206,
                    },
                    {
                      Municipio: "Itaiçaba",
                      Tanques: 166,
                    },
                    {
                      Municipio: "Jaguaribe",
                      Tanques: 42,
                    },
                    {
                      Municipio: "Icapuí",
                      Tanques: 22,
                    },
                    {
                      Municipio: "Cariús",
                      Tanques: 10,
                    },
                    {
                      Municipio: "Limoeiro do Norte",
                      Tanques: 9,
                    },
                    {
                      Municipio: "Quixeré",
                      Tanques: 4,
                    },
                    {
                      Municipio: "Palhano",
                      Tanques: 4,
                    },
                    {
                      Municipio: "Alto Santo",
                      Tanques: 1,
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

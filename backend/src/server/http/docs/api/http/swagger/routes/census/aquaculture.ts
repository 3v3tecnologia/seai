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
                      Municipio: "Jaguaruana",
                      Bacia: "Baixo Jaguaribe",
                      Tanques: 562,
                    },
                    {
                      Municipio: "Aracati",
                      Bacia: "Baixo Jaguaribe",
                      Tanques: 390,
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

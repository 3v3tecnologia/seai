import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "./../../commons/status";
import { BASE_URL } from "../../commons/baseURL";

export const SECURITY_SOCIAL = {
  [`${BASE_URL.V1}/census/indicator/security/social/basin`]: {
    get: {
      tags: ["Census"],
      summary: "Get all security social indicator by basin",
      description: "Get all security social indicator by basin",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "All security social indicator by basin",
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
                          EmpregosPJ: "number",
                          EmpregosPF: "number",
                          "Empregos/ha": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Bacia: "Baixo Jaguaribe",
                      AreaIrrigada: 22695.6,
                      EmpregosPJ: 15736,
                      EmpregosPF: 0,
                      "Empregos/ha": 0.69,
                    },
                    {
                      Bacia: "Alto Jaguaribe",
                      AreaIrrigada: 2417.29,
                      EmpregosPJ: 0,
                      EmpregosPF: 0,
                      "Empregos/ha": 0,
                    },
                    {
                      Bacia: "Médio Jaguaribe",
                      AreaIrrigada: 1306.48,
                      EmpregosPJ: 0,
                      EmpregosPF: 0,
                      "Empregos/ha": 0,
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
  [`${BASE_URL.V1}/census/indicator/security/social/county`]: {
    get: {
      tags: ["Census"],
      summary: "Get all security social indicator by county",
      description: "Get all security social indicator by county",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "All security social indicator by county",
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
                          EmpregosPJ: "number",
                          EmpregosPF: "number",
                          "Empregos/ha": "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      Municipio: "Fortim",
                      AreaIrrigada: 9.5,
                      EmpregosPJ: 19,
                      EmpregosPF: 0,
                      "Empregos/ha": 2,
                    },
                    {
                      Municipio: "Quixeré",
                      AreaIrrigada: 259,
                      EmpregosPJ: 389,
                      EmpregosPF: 0,
                      "Empregos/ha": 1.5,
                    },
                    {
                      Municipio: "Icapuí",
                      AreaIrrigada: 14.5,
                      EmpregosPJ: 21,
                      EmpregosPF: 0,
                      "Empregos/ha": 1.45,
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

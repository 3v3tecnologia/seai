import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "../../commons/status";

const TAGS = ["Weights"];

export const WEIGHTS = {
  [`${BASE_URL.V2}/census/basin`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "Get recorded basin",
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      id: 1,
                      name: "Alto Jaguaribe",
                    },
                    {
                      id: 2,
                      name: "Médio Jaguaribe",
                    },
                    {
                      id: 3,
                      name: "Baixo Jaguaribe",
                    },
                    {
                      id: 5,
                      name: "Salgado",
                    },
                    {
                      id: 4,
                      name: "Banabuiú",
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
  [`${BASE_URL.V2}/census/weights/basin/{year}/{basin_ids}`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "year",
          in: "path",
          description: "Census year",
          required: true,
          schema: {
            type: "number",
          },
        },
        {
          name: "basin_ids",
          in: "path",
          description: "A string with comma-separated equipments ids",
          required: true,
          example: "1,2",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description:
            "Get recorded weights from basin or calculate if not exists",
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      basin_mask: 6,
                      crop: "ABACATE",
                      productivity_ha: 0.5,
                      productivity_m3: 0.5,
                      profitability_ha: 0.5,
                      profitability_m3: 0.5,
                      jobs_ha: 0.5,
                      jobs_1000m3: 0.5,
                      water_consumption: 0.5,
                      crop_cycle: 0.5,
                      year: 2023,
                    },
                    {
                      basin_mask: 6,
                      crop: "ACEROLA",
                      productivity_ha: 0.5,
                      productivity_m3: 0.5,
                      profitability_ha: 0.5,
                      profitability_m3: 0.5,
                      jobs_ha: 0.5,
                      jobs_1000m3: 0.5,
                      water_consumption: 0.5,
                      crop_cycle: 0.5,
                      year: 2023,
                    },
                    {
                      basin_mask: 6,
                      crop: "ALFACE",
                      productivity_ha: 0,
                      productivity_m3: 0,
                      profitability_ha: 0.5,
                      profitability_m3: 0.5,
                      jobs_ha: 0.5,
                      jobs_1000m3: 0.5,
                      water_consumption: 0.5,
                      crop_cycle: 1,
                      year: 2023,
                    },
                    {
                      basin_mask: 6,
                      crop: "ALGODÃO",
                      productivity_ha: 0.5,
                      productivity_m3: 0.5,
                      profitability_ha: 0.5,
                      profitability_m3: 0.5,
                      jobs_ha: 0.5,
                      jobs_1000m3: 1,
                      water_consumption: 0.5,
                      crop_cycle: 0.5,
                      year: 2023,
                    },
                    {
                      basin_mask: 6,
                      crop: "ARROZ",
                      productivity_ha: 0.5,
                      productivity_m3: 0.5,
                      profitability_ha: 0.5,
                      profitability_m3: 0.5,
                      jobs_ha: 0.5,
                      jobs_1000m3: 0.5,
                      water_consumption: 0.5,
                      crop_cycle: 1,
                      year: 2023,
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
  [`${BASE_URL.V2}/census/weights/basin/calculate`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get only calculated data",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["basin_ids"],
              properties: {
                basin_ids: {
                  type: "array",
                  items: {
                    type: "number",
                  },
                  description: "An array of basin IDs",
                },
              },
              example: {
                basin_ids: [1, 2],
              },
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      basin_mask: 3,
                      crop: "CAPIM",
                      productivity_ha: 1,
                      productivity_m3: 1,
                      profitability_ha: 0.75,
                      profitability_m3: 0.5,
                      jobs_ha: 0.5,
                      jobs_1000m3: 0.5,
                      water_consumption: 0.5,
                      crop_cycle: 1,
                      year: null,
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
  [`${BASE_URL.V2}/census/weights/basin`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Create crop",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                basin_ids: [1, 2],
                year: 2023,
                data: [
                  {
                    basin_mask: 3,
                    crop: "CAPIM",
                    productivity_ha: 1,
                    productivity_m3: 1,
                    profitability_ha: 0.75,
                    profitability_m3: 0.5,
                    jobs_ha: 0.5,
                    jobs_1000m3: 0.5,
                    water_consumption: 0.5,
                    crop_cycle: 1,
                    year: null,
                  },
                ],
              },
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "string",
                    },
                  },
                },
                example: {
                  data: "Sucesso ao inserir estudos da bacia.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V2}/census/water-cut`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Calculate water cut",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                basin_ids: [1, 2],
                year: 2023,
              },
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                    },
                  },
                },
                example: {
                  data: [
                    {
                      crop: "CEBOLINHA",
                      water_cut: -31.25,
                    },
                    {
                      crop: "PALMA",
                      water_cut: -31.25,
                    },
                    {
                      crop: "COENTRO",
                      water_cut: -37.5,
                    },
                    {
                      crop: "TOMATE",
                      water_cut: -40.625,
                    },
                    {
                      crop: "ABÓBORA",
                      water_cut: -43.75,
                    },
                    {
                      crop: "MILHO",
                      water_cut: -43.75,
                    },
                    {
                      crop: "FEIJÃO",
                      water_cut: -43.75,
                    },
                    {
                      crop: "CAPIM",
                      water_cut: -43.75,
                    },
                    {
                      crop: "MACAXEIRA",
                      water_cut: -46.875,
                    },
                    {
                      crop: "CANA-DE-AÇÚCAR",
                      water_cut: -50,
                    },
                    {
                      crop: "MAMÃO",
                      water_cut: -50,
                    },
                    {
                      crop: "BANANA",
                      water_cut: -50,
                    },
                    {
                      crop: "CEBOLA",
                      water_cut: -50,
                    },
                    {
                      crop: "ACEROLA",
                      water_cut: -50,
                    },
                    {
                      crop: "PIMENTÃO",
                      water_cut: -53.125,
                    },
                    {
                      crop: "MELANCIA",
                      water_cut: -56.25,
                    },
                    {
                      crop: "MARACUJÁ",
                      water_cut: -56.25,
                    },
                    {
                      crop: "SIRIGUELA",
                      water_cut: -56.25,
                    },
                    {
                      crop: "SORGO",
                      water_cut: -56.25,
                    },
                    {
                      crop: "ARROZ",
                      water_cut: -56.25,
                    },
                    {
                      crop: "ABACAXI",
                      water_cut: -56.25,
                    },
                    {
                      crop: "AMENDOIM",
                      water_cut: -59.375,
                    },
                    {
                      crop: "UVA",
                      water_cut: -59.375,
                    },
                    {
                      crop: "GOIABA",
                      water_cut: -62.5,
                    },
                    {
                      crop: "CAJU",
                      water_cut: -62.5,
                    },
                    {
                      crop: "COCO",
                      water_cut: -62.5,
                    },
                    {
                      crop: "ABACATE",
                      water_cut: -62.5,
                    },
                    {
                      crop: "GRAVIOLA",
                      water_cut: -62.5,
                    },
                    {
                      crop: "LARANJA",
                      water_cut: -62.5,
                    },
                    {
                      crop: "MANGA",
                      water_cut: -62.5,
                    },
                    {
                      crop: "OUTROS",
                      water_cut: -62.5,
                    },
                    {
                      crop: "PIMENTA",
                      water_cut: -62.5,
                    },
                    {
                      crop: "ALFACE",
                      water_cut: -65.625,
                    },
                    {
                      crop: "COUVE",
                      water_cut: -68.75,
                    },
                    {
                      crop: "BATATA DOCE",
                      water_cut: -68.75,
                    },
                    {
                      crop: "BATATA",
                      water_cut: -68.75,
                    },
                    {
                      crop: "TANGERINA",
                      water_cut: -68.75,
                    },
                    {
                      crop: "URUCUM",
                      water_cut: -71.875,
                    },
                    {
                      crop: "HORTELÃ",
                      water_cut: -75,
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

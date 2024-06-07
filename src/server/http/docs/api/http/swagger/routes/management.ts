import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["Management"];

export const MANAGEMENT = {
  [`${BASE_URL.V1}/management/crop`]: {
    get: {
      tags: ["Irrigant"],
      parameters: [
        {
          name: "name",
          in: "query",
          description: "Crop name",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Get all crops",
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      Id: 3,
                      Name: "ALFACE",
                      LocationName: "FORTALEZA",
                    },
                    {
                      Id: 4,
                      Name: "FEIJÃO",
                      LocationName: "FORTALEZA",
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
                Name: "FEIJÃO5",
                LocationName: null,
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
                  data: 1,
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/management/crop/cycles/{id}`]: {
    get: {
      tags: TAGS,
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Crop id",
          required: false,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Get crop cycles",
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      Title: "test2",
                      Start: 1,
                      End: 3,
                      KC: 54,
                      Increment: 1,
                    },
                    {
                      Title: "test2",
                      Start: 1,
                      End: 3,
                      KC: 54,
                      Increment: 3,
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
                data: [
                  {
                    Stage: 1,
                    Title: "test2",
                    Start: 1,
                    End: 3,
                    KC: 54,
                    Increment: 1,
                  },
                  {
                    Stage: 2,
                    Title: "test2",
                    Start: 1,
                    End: 3,
                    KC: 54,
                    Increment: 3,
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
                  data: "Sucesso ao criar ciclos de cultura.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/management/crop/{id}`]: {
    get: {
      tags: TAGS,
      summary: "Get crop by id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Id crop",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    Id: 3,
                    Name: "ALFACE",
                    LocationName: "FORTALEZA",
                  },
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    put: {
      tags: TAGS,
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Crop Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                Name: "LIMÃO",
                LocationName: "ESTADOS",
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
                  data: "Sucesso ao atualizar cultura.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    delete: {
      tags: TAGS,
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Crop Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
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
                  data: "Sucesso ao deletar cultura.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/management/studies/{id}`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get crop by id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Id Basin",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Daily stations measures",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: [
                    {
                      Crop: "ACEROLA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "ACEROLA ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "ALFACE",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "ALGODÃO",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "ATA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "BANANA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "BATATA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "BATATA DOCE",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "CAJU",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "CANA-DE-AÇÚCAR",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "CAPIM",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "CAPIM ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "CEBOLA ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "CEBOLINHA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "COCO",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "COENTRO",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "FEIJÃO",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "FEIJÃO ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "GOIABA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "HORTELÃ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "LARANJA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "LIMÃO",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "MACAXEIRA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "MACAXEIRA ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "MAMÃO",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "MANGA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "MARACUJÁ ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "MILHO",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "MILHO ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "OUTROS ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "PALMA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "PALMA ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "PIMENTA ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "PIMENTÃO",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "PIMENTÃO ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "PITAYA",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "ROMÃ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "SORGO",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
                    },
                    {
                      Crop: "URUCUM ",
                      Consumption: null,
                      CultivationPeriod: null,
                      HarvestDuration: null,
                      Productivity: null,
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
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Basin Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                data: [
                  {
                    Crop: "Tomate",
                    Productivity: 1,
                    Consumption: 1,
                    HarvestDuration: 3,
                    CultivationPeriod: 1,
                  },
                  {
                    Crop: "Tomate",
                    HarvestDuration: 3,
                    CultivationPeriod: 1,
                    Consumption: 2,
                    Productivity: 1,
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
                  data: "Sucesso ao atualizar cultura  5.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/management/weights/{id}`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get weights by basin id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Id Basin",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Weights by basin",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: [
                    {
                      Crop: "BANANA",
                      ProductivityPerHectare: 0,
                      ProductivityPerMeters: 1,
                      ProfitabilityPerHectare: 4,
                      ProfitabilityPerMeters: 3,
                      JobsPerMeters: 6,
                      JobsPerHectare: 5,
                      WaterConsumption: 0,
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
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Basin Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                data: [
                  {
                    Crop: "BANANA",
                    ProductivityPerHectare: 0,
                    ProductivityPerMeters: 1,
                    ProfitabilityPerHectare: 4,
                    ProfitabilityPerMeters: 3,
                    JobsPerMeters: 6,
                    JobsPerHectare: 5,
                    WaterConsumption: 0,
                  },
                ],
              },
            },
          },
        },
      },
      responses: {
        201: {
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
                  data: "Sucesso ao adicionar pesos para a bacia 1",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/management/blade_suggestion`]: {
    post: {
      tags: ["Irrigant"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                Station: {
                  Id: 36,
                  Et0: 2.1,
                },
                CropId: 1,
                Pluviometer: {
                  Precipitation: 26.0,
                },
                PlantingDate: "14/04/2024",
                System: {
                  Type: "Aspersão",
                  Measurements: {
                    Efficiency: 75,
                    Precipitation: 2,
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
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
                  data: {
                    Etc: 6.4800234,
                    RepositionBlade: 5.430331393939395,
                    IrrigationTime: "05:25",
                    CropDays: 1,
                    Et0: 3.2400117,
                    Precipitation: 2,
                    Kc: 2,
                  },
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

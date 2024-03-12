import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["Management"];

export const MANAGEMENT = {
  [`${BASE_URL.V2}/management/crop`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
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
                Cycles: [
                  {
                    Stage: 1,
                    Title: "test",
                    DurationInDays: 12,
                    KC: 54,
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
                  data: "Sucesso ao criar cultura 4.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V2}/management/crop/{id}`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
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
          description: "Daily stations measures",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: {
                  data: {
                    Id: 3,
                    Name: "ALFACE",
                    LocationName: "FORTALEZA",
                    Cycles: [
                      {
                        Title: "test",
                        DurationInDays: 12,
                        KC: 54,
                      },
                      {
                        Title: "test",
                        DurationInDays: 12,
                        KC: 54,
                      },
                    ],
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
                Cycles: [
                  {
                    Stage: 1,
                    Title: "test",
                    DurationInDays: 12,
                    KC: 54,
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
                  data: "Sucesso ao deletar cultura  5.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V2}/management/studies/{id}`]: {
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
};

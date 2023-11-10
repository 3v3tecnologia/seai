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
                      Municipio: "Acopiara",
                      ConsumoTotal: 297696,
                      AreaIrrigadaTotal: 15.799999,
                      "m³/ha": 18841.52,
                    },
                    {
                      Municipio: "Aiuaba",
                      ConsumoTotal: 113569,
                      AreaIrrigadaTotal: 35.1,
                      "m³/ha": 3235.5842,
                    },
                    {
                      Municipio: "Altaneira",
                      ConsumoTotal: 30960,
                      AreaIrrigadaTotal: 17,
                      "m³/ha": 1821.1765,
                    },
                    {
                      Municipio: "Alto Santo",
                      ConsumoTotal: 195240,
                      AreaIrrigadaTotal: 122.99998,
                      "m³/ha": 1587.3174,
                    },
                    {
                      Municipio: "Antonina do Norte",
                      ConsumoTotal: 21804,
                      AreaIrrigadaTotal: 11.01,
                      "m³/ha": 1980.3815,
                    },
                    {
                      Municipio: "Aracati",
                      ConsumoTotal: 3054396,
                      AreaIrrigadaTotal: 15532.3955,
                      "m³/ha": 196.6468,
                    },
                    {
                      Municipio: "Araripe",
                      ConsumoTotal: 315360,
                      AreaIrrigadaTotal: 9.299999,
                      "m³/ha": 33909.68,
                    },
                    {
                      Municipio: "Arneiroz",
                      ConsumoTotal: 49344,
                      AreaIrrigadaTotal: 22.5,
                      "m³/ha": 2193.0667,
                    },
                    {
                      Municipio: "Assaré",
                      ConsumoTotal: 1063620,
                      AreaIrrigadaTotal: 36,
                      "m³/ha": 29545,
                    },
                    {
                      Municipio: "Campos Sales",
                      ConsumoTotal: 506656,
                      AreaIrrigadaTotal: 38.1,
                      "m³/ha": 13298.059,
                    },
                    {
                      Municipio: "Cariús",
                      ConsumoTotal: 2531870,
                      AreaIrrigadaTotal: 256.50006,
                      "m³/ha": 9870.836,
                    },
                    {
                      Municipio: "Catarina",
                      ConsumoTotal: 181530,
                      AreaIrrigadaTotal: 22.100002,
                      "m³/ha": 8214.026,
                    },
                    {
                      Municipio: "Deputado Irapuan Pinheiro",
                      ConsumoTotal: 299016,
                      AreaIrrigadaTotal: 33,
                      "m³/ha": 9061.091,
                    },
                    {
                      Municipio: "Ererê",
                      ConsumoTotal: 246648,
                      AreaIrrigadaTotal: 46.950005,
                      "m³/ha": 5253.418,
                    },
                    {
                      Municipio: "Farias Brito",
                      ConsumoTotal: 283200,
                      AreaIrrigadaTotal: 25.7,
                      "m³/ha": 11019.455,
                    },
                    {
                      Municipio: "Fortim",
                      ConsumoTotal: 25920,
                      AreaIrrigadaTotal: 9.5,
                      "m³/ha": 2728.4211,
                    },
                    {
                      Municipio: "Icapuí",
                      ConsumoTotal: 284400,
                      AreaIrrigadaTotal: 14.5,
                      "m³/ha": 19613.793,
                    },
                    {
                      Municipio: "Icó",
                      ConsumoTotal: 3624730,
                      AreaIrrigadaTotal: 487.7,
                      "m³/ha": 7432.2944,
                    },
                    {
                      Municipio: "Iguatu",
                      ConsumoTotal: 5720255,
                      AreaIrrigadaTotal: 423.20032,
                      "m³/ha": 13516.66,
                    },
                    {
                      Municipio: "Iracema",
                      ConsumoTotal: 126768,
                      AreaIrrigadaTotal: 31.9,
                      "m³/ha": 3973.9185,
                    },
                    {
                      Municipio: "Itaiçaba",
                      ConsumoTotal: 1722240,
                      AreaIrrigadaTotal: 24,
                      "m³/ha": 71760,
                    },
                    {
                      Municipio: "Jaguaretama",
                      ConsumoTotal: 716064,
                      AreaIrrigadaTotal: 21.8,
                      "m³/ha": 32846.973,
                    },
                    {
                      Municipio: "Jaguaribara",
                      ConsumoTotal: 6173904,
                      AreaIrrigadaTotal: 309,
                      "m³/ha": 19980.271,
                    },
                    {
                      Municipio: "Jaguaribe",
                      ConsumoTotal: 7366536,
                      AreaIrrigadaTotal: 521,
                      "m³/ha": 14139.225,
                    },
                    {
                      Municipio: "Jaguaruana",
                      ConsumoTotal: 6177600,
                      AreaIrrigadaTotal: 98,
                      "m³/ha": 63036.734,
                    },
                    {
                      Municipio: "Jucás",
                      ConsumoTotal: 2845086.2,
                      AreaIrrigadaTotal: 276.1002,
                      "m³/ha": 10304.543,
                    },
                    {
                      Municipio: "Limoeiro do Norte",
                      ConsumoTotal: 41901192,
                      AreaIrrigadaTotal: 4109.8,
                      "m³/ha": 10195.434,
                    },
                    {
                      Municipio: "Milhã",
                      ConsumoTotal: 63216,
                      AreaIrrigadaTotal: 21.63,
                      "m³/ha": 2922.6077,
                    },
                    {
                      Municipio: "Nova Olinda",
                      ConsumoTotal: 301116,
                      AreaIrrigadaTotal: 22.600006,
                      "m³/ha": 13323.713,
                    },
                    {
                      Municipio: "Orós",
                      ConsumoTotal: 992010,
                      AreaIrrigadaTotal: 212.20004,
                      "m³/ha": 4674.8813,
                    },
                    {
                      Municipio: "Palhano",
                      ConsumoTotal: 23040,
                      AreaIrrigadaTotal: 0,
                      "m³/ha": 0,
                    },
                    {
                      Municipio: "Parambu",
                      ConsumoTotal: 13200,
                      AreaIrrigadaTotal: 8.6,
                      "m³/ha": 1534.8837,
                    },
                    {
                      Municipio: "Pereiro",
                      ConsumoTotal: 35928,
                      AreaIrrigadaTotal: 118.899994,
                      "m³/ha": 302.1699,
                    },
                    {
                      Municipio: "Potengi",
                      ConsumoTotal: 71136,
                      AreaIrrigadaTotal: 48.300003,
                      "m³/ha": 1472.7949,
                    },
                    {
                      Municipio: "Potiretama",
                      ConsumoTotal: 16200,
                      AreaIrrigadaTotal: 2.8999996,
                      "m³/ha": 5586.2075,
                    },
                    {
                      Municipio: "Quixelô",
                      ConsumoTotal: 236118,
                      AreaIrrigadaTotal: 68.17999,
                      "m³/ha": 3463.1567,
                    },
                    {
                      Municipio: "Quixeré",
                      ConsumoTotal: 316946.44,
                      AreaIrrigadaTotal: 259,
                      "m³/ha": 1223.7314,
                    },
                    {
                      Municipio: "Russas",
                      ConsumoTotal: 43399444,
                      AreaIrrigadaTotal: 2648.4,
                      "m³/ha": 16387.043,
                    },
                    {
                      Municipio: "Saboeiro",
                      ConsumoTotal: 343290.5,
                      AreaIrrigadaTotal: 37.599995,
                      "m³/ha": 9130.067,
                    },
                    {
                      Municipio: "Solonópole",
                      ConsumoTotal: 74784,
                      AreaIrrigadaTotal: 22.7,
                      "m³/ha": 3294.4492,
                    },
                    {
                      Municipio: "São João do Jaguaribe",
                      ConsumoTotal: 50400,
                      AreaIrrigadaTotal: 10,
                      "m³/ha": 5040,
                    },
                    {
                      Municipio: "Tabuleiro do Norte",
                      ConsumoTotal: 408296,
                      AreaIrrigadaTotal: 43.699997,
                      "m³/ha": 9343.158,
                    },
                    {
                      Municipio: "Tarrafas",
                      ConsumoTotal: 711715,
                      AreaIrrigadaTotal: 329.30002,
                      "m³/ha": 2161.2966,
                    },
                    {
                      Municipio: "Tauá",
                      ConsumoTotal: 182810,
                      AreaIrrigadaTotal: 14.4,
                      "m³/ha": 12695.14,
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

import { DEFAULT_RESPONSES } from "../../commons/status";
import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";

export const ANIMALS = {
  [`${BASE_URL.V1}/census/animals/consumption`]: {
    get: {
      tags: ["Census"],
      summary: "Get animal consumption census by basin",
      description: "Get animal consumption census by basin",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "Get all animals consumption",
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
                          TipoCriacao: "string",
                          Consumo: "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      TipoCriacao: "Bovinos",
                      Consumo: 50,
                    },
                    {
                      TipoCriacao: "Equinos",
                      Consumo: 39.97,
                    },
                    {
                      TipoCriacao: "Suínos",
                      Consumo: 15.1,
                    },
                    {
                      TipoCriacao: "Caprinos",
                      Consumo: 10.04,
                    },
                    {
                      TipoCriacao: "Ovinos",
                      Consumo: 9.96,
                    },
                    {
                      TipoCriacao: "Aves",
                      Consumo: 1.83,
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
  [`${BASE_URL.V1}/census/animals/basin`]: {
    get: {
      tags: ["Census"],
      summary: "Get animal consumption census",
      description: "Get animal consumption census",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "Get all animals consumption",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      items: {
                        type: "object",
                        properties: {
                          BasinName: {
                            type: "object",
                            items: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  TipoCriacao: "string",
                                  Quantidade: "number",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    "Alto Jaguaribe": [
                      {
                        TipoCriacao: "Aves",
                        Quantidade: 11459,
                      },
                      {
                        TipoCriacao: "Bovinos",
                        Quantidade: 18832,
                      },
                      {
                        TipoCriacao: "Equinos",
                        Quantidade: 359,
                      },
                      {
                        TipoCriacao: "Caprinos",
                        Quantidade: 2847,
                      },
                      {
                        TipoCriacao: "Ovinos",
                        Quantidade: 5749,
                      },
                      {
                        TipoCriacao: "Suínos",
                        Quantidade: 2431,
                      },
                      {
                        TipoCriacao: "Outros",
                        Quantidade: 0,
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
  },
  [`${BASE_URL.V1}/census/animals/county`]: {
    get: {
      tags: ["Census"],
      summary: "Get animal consumption census by county",
      description: "Get animal consumption census by county",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "Get all animals consumption by county",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      items: {
                        type: "object",
                        properties: {
                          CountyName: {
                            type: "object",
                            items: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  Bacia: "string",
                                  TipoCriacao: "string",
                                  Quantidade: "number",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Acopiara: [
                      {
                        TipoCriacao: "Aves",
                        Quantidade: 147,
                        Bacia: "Alto Jaguaribe",
                      },
                      {
                        TipoCriacao: "Bovinos",
                        Quantidade: 387,
                        Bacia: "Alto Jaguaribe",
                      },
                      {
                        TipoCriacao: "Equinos",
                        Quantidade: 0,
                        Bacia: "Alto Jaguaribe",
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
  },
};

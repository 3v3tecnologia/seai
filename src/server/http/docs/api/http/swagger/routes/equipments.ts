import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";
import { BASE_URL } from "../commons/baseURL";
import { PaginationSchema } from "../commons/withPagination";

const TAGS = ["Equipments"];

const IRRIGANT = {
  [`${BASE_URL.V1}/equipments/activated`]: {
    get: {
      tags: ["Irrigant"],
      summary: "Get all equipments with yesterday's measurements",
      parameters: [
        {
          name: "type",
          in: "query",
          required: true,
          description: "Equipment type",
          schema: {
            type: "string",
            enum: ["station", "pluviometer"],
          },
        },
        {
          name: "latitude",
          in: "query",
          required: false,
          schema: {
            type: "number",
          },
        },
        {
          name: "longitude",
          in: "query",
          required: false,
          schema: {
            type: "number",
          },
        },
        {
          name: "distance",
          description: "Distance in Kilometers",
          in: "query",
          required: false,
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
                properties: {
                  data: {
                    type: "array",
                  },
                },
                example: {
                  StationExample: {
                    data: [
                      {
                        Id: 1,
                        Code: "B850A89C",
                        Name: "São Benedito - Sítio Ingazeira",
                        Type: {
                          Id: 1,
                          Name: "station",
                        },
                        Organ: {
                          Id: 2,
                          Name: "FUNCEME",
                        },
                        Altitude: 844,
                        Location: {
                          Coordinates: [-3.995388889, -40.955111111],
                        },
                        Et0: 3.0475848,
                      },
                      {
                        Id: 36,
                        Code: "32321",
                        Name: "Fortaleza - Itaperi",
                        Type: {
                          Id: 1,
                          Name: "station",
                        },
                        Organ: {
                          Id: 2,
                          Name: "FUNCEME",
                        },
                        Altitude: 28,
                        Location: {
                          Coordinates: [-3.795127, -38.557368],
                        },
                        Et0: 1.577899,
                      },
                    ],
                  },
                  PluviometerExample: {
                    data: [
                      {
                        Id: 133,
                        Code: "24302",
                        Name: "MINEIROLANDIA",
                        Type: {
                          Id: 2,
                          Name: "pluviometer",
                        },
                        Organ: {
                          Id: 2,
                          Name: "FUNCEME",
                        },
                        Altitude: null,
                        Location: {
                          Coordinates: [-5.567, -39.633305556],
                        },
                        Precipitation: 38,
                      },
                      {
                        Id: 132,
                        Code: "24110",
                        Name: "SAO GONCALO DO AMARANTE",
                        Type: {
                          Id: 2,
                          Name: "pluviometer",
                        },
                        Organ: {
                          Id: 2,
                          Name: "FUNCEME",
                        },
                        Altitude: null,
                        Location: {
                          Coordinates: [-3.674722222, -38.979722222],
                        },
                        Precipitation: 21,
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

export const EQUIPMENTS = {
  [`${BASE_URL.V2}/equipments/last-updated-at`]: {
    get: {
      tags: TAGS,
      summary: "Get all equipments",
      description: "List all stations and pluviometer",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "All equipments",
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      Time: "2024-05-03T18:52:22.192Z",
                      Id_Organ: 1
                    }
                  ]
                }
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/equipments`]: {
    get: {
      tags: TAGS,
      summary: "Get all equipments",
      description: "List all stations and pluviometer",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "pageNumber",
          in: "query",
          description: "Pagination number. Default 1",
          required: false,
          schema: {
            type: "number",
          },
        },
        {
          name: "limit",
          in: "query",
          description: "Data limit",
          required: false,
          schema: {
            type: "number",
          },
        },
        {
          name: "idType",
          in: "query",
          description: "Id equipment type",
          required: false,
          schema: {
            type: "number",
          },
        },
        {
          name: "idOrgan",
          in: "query",
          description: "Equipment organ",
          required: false,
          schema: {
            type: "number",
          },
        },
        {
          name: "name",
          in: "query",
          description:
            "Textual filter by equipment name or code or location name",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "All equipments",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            Id: "number",
                            Code: "number",
                            Name: "string",
                            Type: {
                              type: "object",
                              properties: {
                                Id: "number",
                                Name: "string",
                              },
                            },
                            Altitude: "number",
                            Organ: {
                              type: "object",
                              properties: {
                                Id: "number",
                                Name: "string",
                              },
                            },
                            Location: {
                              type: "object",
                              properties: {
                                Coordinates: {
                                  type: "array",
                                  items: {
                                    type: "number",
                                  },
                                },
                              },
                            },
                            CreatedAt: "string",
                            UpdatedAt: "string",
                            Enable: "boolean",
                          },
                        },
                      },
                      ...PaginationSchema,
                    },
                  },
                },
                example: {
                  data: {
                    data: {
                      Items: [
                        {
                          Id: 1,
                          Code: "B850A89C",
                          Name: "São Benedito - Sítio Ingazeira",
                          Type: {
                            Id: 1,
                            Name: "station",
                          },
                          Organ: {
                            Id: 2,
                            Name: "FUNCEME",
                          },
                          Altitude: 844,
                          Location: {
                            Coordinates: [-3.995388889, -40.955111111],
                          },
                          CreatedAt: "2024-03-29T02:34:51.281+00:00",
                          UpdatedAt: "2024-04-01T19:56:15.697297+00:00",
                          Enable: true,
                        },
                        {
                          Id: 2,
                          Code: "A315",
                          Name: "BARBALHA",
                          Type: {
                            Id: 1,
                            Name: "station",
                          },
                          Organ: {
                            Id: 2,
                            Name: "FUNCEME",
                          },
                          Altitude: 409.41,
                          Location: {
                            Coordinates: [-7.300925, -39.271107],
                          },
                          CreatedAt: "2024-03-29T02:34:51.281+00:00",
                          UpdatedAt: "2024-04-01T19:56:50.264197+00:00",
                          Enable: true,
                        },
                      ],
                      TotalItems: 94,
                      Page: 1,
                      PageSize: 2,
                      TotalPages: 47,
                    },
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
  [`${BASE_URL.V1}/equipments/{id}`]: {
    put: {
      tags: TAGS,
      summary: "Update equipments",
      description: "Update equipment by id",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Equipment Id",
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
              properties: {
                Enable: "boolean",
              },
              example: {
                Enable: true,
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Equipment updated successfully",
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
                  data: "Sucesso ao atualizar equipamento x.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  ...IRRIGANT,
};

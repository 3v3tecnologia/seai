import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";
import { BASE_URL } from "../commons/baseURL";

const TAGS = ["Equipments"];

export const EQUIPMENTS = {
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
                      Equipments: {
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
                      PageNumber: {
                        type: "number",
                      },
                      QtdRows: {
                        type: "number",
                      },
                      PageLimitRows: {
                        type: "number",
                      },
                      QtdPages: {
                        type: "number",
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Equipments: [
                      {
                        Id: 17,
                        Code: "B8524E9A",
                        Name: "Alto Santo - Castanhão",
                        Type: {
                          Id: 1,
                          Name: "station",
                        },
                        Organ: {
                          Id: 2,
                          Name: "FUNCEME",
                        },
                        Altitude: 4,
                        Location: {
                          Coordinates: [-30.1162, -8.9124],
                        },
                        CreatedAt: "2023-11-06T12:52:23.953Z",
                        UpdatedAt: "2023-11-06T12:55:17.233Z",
                        Enable: true,
                      },
                    ],
                    PageNumber: 0,
                    QtdRows: 1,
                    PageLimitRows: 90,
                    QtdPages: 1,
                  },
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    /*post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Create equipment",
      description: "Create meteorological equipment",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                IdEquipmentExternal: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Altitude: {
                  type: "string",
                },
                Location: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    Coordinates: {
                      type: "array",
                      items: {
                        type: "number",
                      },
                    },
                  },
                },
                Fk_Organ: {
                  type: "string",
                },
                Fk_Type: {
                  type: "string",
                },
                Enable: "boolean",
              },
              example: {
                IdEquipmentExternal: "TESTE1",
                Name: "teste123",
                Altitude: 54,
                Location: {
                  Name: "Test3",
                  Coordinates: [-38.5162, -4.1124],
                },
                Fk_Organ: 2,
                Fk_Type: 1,
                Enable: true,
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Equipment created successfully",
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
                  data: 6,
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },*/
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
    /*delete: {
      tags: TAGS,
      summary: "Delete equipment",
      description: "Delete equipment by id",
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
      responses: {
        200: {
          description: "Equipment deleted successfully",
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
                  data: "Equipamento 4 deletado com sucesso.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },*/
  },
  [`${BASE_URL.V1}/equipments/pluviometers`]: {
    get: {
      tags: TAGS,
      summary: "Get all pluviometers with last measurement record",
      parameters: [
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
          in: "query",
          required: false,
          schema: {
            type: "number",
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
                example: {
                  data: [
                    {
                      Id: 2,
                      Code: "TESTE",
                      Name: "PLUV",
                      Type: {
                        Id: 2,
                        Name: "pluviometer",
                      },
                      Organ: {
                        Id: 2,
                        Name: "FUNCEME",
                      },
                      Altitude: 1,
                      Location: null,
                      Measurements: {
                        Time: "2024-03-12T00:00:00.000Z",
                        Hour: null,
                        Precipitation: {
                          Unit: "mm",
                          Value: 0,
                        },
                      },
                    },
                    {
                      Id: 3,
                      Code: "23978",
                      Name: "ABAIARA",
                      Type: {
                        Id: 2,
                        Name: "pluviometer",
                      },
                      Organ: {
                        Id: 2,
                        Name: "FUNCEME",
                      },
                      Altitude: 1,
                      Location: null,
                      Measurements: {
                        Time: "2024-03-12T00:00:00.000Z",
                        Hour: null,
                        Precipitation: {
                          Unit: "mm",
                          Value: 4.5,
                        },
                      },
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
  [`${BASE_URL.V1}/equipments/stations`]: {
    get: {
      tags: TAGS,
      summary: "Get all stations with last measurement record",
      parameters: [
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
          in: "query",
          required: false,
          schema: {
            type: "number",
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
                example: {
                  data: [
                    {
                      Id: 4,
                      Code: "TEST",
                      Name: "ESTACAO-TESTE",
                      Type: {
                        Id: 1,
                        Name: "station",
                      },
                      Organ: {
                        Id: 2,
                        Name: "FUNCEME",
                      },
                      Altitude: 1,
                      Location: null,
                      Measurements: {
                        Time: "2024-03-12T00:00:00.000Z",
                        Hour: null,
                        Altitude: {
                          Unit: "m",
                          Value: 1,
                        },
                        ETO: {
                          Unit: "mm",
                          Value: null,
                        },
                      },
                    },
                    {
                      Id: 1,
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
                      Altitude: 30.4,
                      Location: null,
                      Measurements: {
                        Time: "2024-03-12T00:00:00.000Z",
                        Hour: null,
                        Altitude: {
                          Unit: "m",
                          Value: 30.4,
                        },
                        ETO: {
                          Unit: "mm",
                          Value: null,
                        },
                      },
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

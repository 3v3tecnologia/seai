import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";
import { BASE_URL } from "../commons/baseURL";
import { PaginationSchema } from "../commons/withPagination";

const TAGS = ["Equipments"];

export const EQUIPMENTS = {
  [`${BASE_URL.V2}/equipments/last-updated-at`]: {
    get: {
      tags: TAGS,
      summary: "Get last update date",
      description: "Get by meteorological organ",
      security: [BEARER_AUTH],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      Time: "2024-05-03T18:52:22.192Z",
                      Id_Organ: 1,
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
        {
          name: "only_with_measurements",
          in: "query",
          description:
            "Filter equipment that has measurements. It is necessary to pass the equipment type ID before",
          required: false,
          schema: {
            type: "boolean",
          },
        },
        {
          name: "enabled",
          in: "query",
          required: false,
          schema: {
            type: "boolean",
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
                            LastSync: "string",
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
                          LastSync: "2024-05 - 10T18: 26:07.738Z",
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
                          LastSync: "2024-05 - 10T18: 26:07.738Z",
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
};

import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["Irrigant"];

export const IRRIGANT = {
  [`${BASE_URL.V2}/management/crops`]: {
    get: {
      tags: TAGS,
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
  },
  [`${BASE_URL.V2}/management/blade_suggestion`]: {
    post: {
      tags: TAGS,
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
                    IrrigationEfficiency: 0.825,
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
  [`${BASE_URL.V1}/equipments/activated`]: {
    get: {
      tags: TAGS,
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
                        LastSync: "2024-05 - 10T18: 26:07.738Z",
                        Et0: 3.04,
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
                        LastSync: "2024-05 - 10T18: 26:07.738Z",
                        Et0: 1.57,
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
                        LastSync: "2024-05 - 10T18: 26:07.738Z",
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
                        LastSync: "2024-05 - 10T18: 26:07.738Z",
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
  [`${BASE_URL.V2}/management/user/irrigation_crops/{id}`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Irrigation id",
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
                example: {
                  data: {
                    Id: 1,
                    CropId: 1,
                    Crop: "sorgo",
                    SystemType: "Pivô Central",
                    PlantingDate: "2024-06-15T00:00:00.000Z",
                    StationId: 20,
                    ETo: 4.571851,
                    PluviometerId: 200,
                    Pluviometry: null,
                    Flow: null,
                    Area: null,
                    EffectiveArea: null,
                    PlantsQtd: null,
                    System_Precipitation: 10,
                    Length: null,
                    Spacing: null,
                    CreatedAt: "2024-06-20T00:00:00.000Z",
                    UpdatedAt: null,
                  },
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    patch: {
      tags: TAGS,
      security: [BEARER_AUTH],
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
        204: {
          content: {
            "application/json": {
              schema: {
                example: {
                  description: "Updated successfully",
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
          description: "Irrigation id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        204: {
          description: "Deleted successfully",
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V2}/management/user/irrigation_crops`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
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
                example: {
                  data: 6,
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      Id: 4,
                      CropId: 1,
                      Crop: "sorgo",
                      SystemType: "Pivô Central",
                      PlantingDate: "2024-10-04T00:00:00.000Z",
                      StationId: 20,
                      ETo: 3.6001275,
                      PluviometerId: 200,
                      Pluviometry: 20,
                      Flow: null,
                      Area: null,
                      EffectiveArea: null,
                      PlantsQtd: null,
                      System_Precipitation: 1,
                      Length: null,
                      Spacing: null,
                      CreatedAt: "2024-06-21T00:00:00.000Z",
                      UpdatedAt: null,
                    },
                    {
                      Id: 1,
                      CropId: 1,
                      Crop: "sorgo",
                      SystemType: "Pivô Central",
                      PlantingDate: "2024-06-15T00:00:00.000Z",
                      StationId: 20,
                      ETo: 3.6001275,
                      PluviometerId: 200,
                      Pluviometry: 20,
                      Flow: null,
                      Area: null,
                      EffectiveArea: null,
                      PlantsQtd: null,
                      System_Precipitation: 10,
                      Length: null,
                      Spacing: null,
                      CreatedAt: "2024-06-20T00:00:00.000Z",
                      UpdatedAt: null,
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
  [`${BASE_URL.V2}/management/user/settings/equipments`]: {
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                StationId: 10,
                PluviometerId: 200,
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
                example: {
                  data: "Sucesso ao salvar equipamentos",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
    patch: {
      tags: TAGS,
      security: [BEARER_AUTH],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                StationId: 10,
                PluviometerId: 200,
              },
            },
          },
        },
      },
      responses: {
        204: {
          description: "Updated successfully",
        },
        ...DEFAULT_RESPONSES,
      },
    },
    delete: {
      tags: TAGS,
      security: [BEARER_AUTH],
      responses: {
        204: {
          description: "Deleted successfully",
        },
        ...DEFAULT_RESPONSES,
      },
    },
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      user_id: 1,
                      station_id: 20,
                      pluviometer_id: 200,
                      created_at: "2024-06-21T00:00:00.000Z",
                      updated_at: "2024-06-21T18:02:31.260Z",
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
  [`${BASE_URL.V2}/management/user/settings/notifications`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                example: {
                  data: [
                    {
                      ServiceId: 1,
                      Service: "newsletter",
                      Enabled: false,
                    },
                    {
                      ServiceId: 2,
                      Service: "irrigation",
                      Enabled: true,
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
  [`${BASE_URL.V2}/management/user/settings/notifications/{id}`]: {
    patch: {
      tags: TAGS,
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Irrigation id",
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
                Enabled: true,
              },
            },
          },
        },
      },
      responses: {
        204: {
          description: "Updated successfully",
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
};

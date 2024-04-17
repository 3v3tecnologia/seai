import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["Equipments Measures"];

export const MEASURES = {
  // [`${BASE_URL.V1}/equipments/measures/stations`]: {
  //   get: {
  //     tags: TAGS,
  //     security: [BEARER_AUTH],
  //     summary: "Get all stations measures",
  //     description: "List all daily stations measures",
  //     parameters: [
  //       {
  //         name: "idEquipment",
  //         in: "query",
  //         description: "Equipment",
  //         required: true,
  //         schema: {
  //           type: "number",
  //         },
  //       },
  //       {
  //         name: "pageNumber",
  //         in: "query",
  //         description: "Pagination number. Default 1",
  //         required: false,
  //         schema: {
  //           type: "number",
  //         },
  //       },
  //       {
  //         name: "start",
  //         in: "query",
  //         description: "Start date YYYY-MM-DD",
  //         required: false,
  //         schema: {
  //           type: "string",
  //         },
  //       },
  //       {
  //         name: "end",
  //         in: "query",
  //         description: "End date YYYY-MM-DD",
  //         required: false,
  //         schema: {
  //           type: "string",
  //         },
  //       },
  //     ],
  //     responses: {
  //       200: {
  //         description: "Daily stations measures",
  //         content: {
  //           "application/json": {
  //             schema: {
  //               type: "object",
  //               items: {
  //                 type: "object",
  //                 properties: {
  //                   data: {
  //                     type: "object",
  //                     items: {
  //                       type: "array",
  //                       items: {
  //                         type: "object",
  //                         properties: {
  //                           IdRead: "number",
  //                           Time: "string",
  //                           Hour: "number",
  //                           IdEquipment: "number",
  //                           Code: "number",
  //                           OrganName: "string",
  //                           Altitude: "number",
  //                           Measures: {
  //                             type: "object",
  //                             properties: {
  //                               TotalRadiation: {
  //                                 type: "object",
  //                                 properties: {
  //                                   Unit: "string",
  //                                   Value: "number",
  //                                 },
  //                               },
  //                               RelativeHumidity: {
  //                                 type: "object",
  //                                 properties: {
  //                                   Unit: "string",
  //                                   Value: "number",
  //                                 },
  //                               },
  //                               AtmosphericTemperature: {
  //                                 type: "object",
  //                                 properties: {
  //                                   Unit: "string",
  //                                   Value: "number",
  //                                 },
  //                               },
  //                               WindVelocity: {
  //                                 type: "object",
  //                                 properties: {
  //                                   Unit: "string",
  //                                   Value: "number",
  //                                 },
  //                               },
  //                               ETO: {
  //                                 type: "object",
  //                                 properties: {
  //                                   Unit: "string",
  //                                   Value: "number",
  //                                 },
  //                               },
  //                             },
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //               example: {
  //                 data: {
  //                   Items: [
  //                     {
  //                       IdRead: 78,
  //                       Time: "2023-11-05",
  //                       Hour: null,
  //                       Altitude: {
  //                         Unit: "m",
  //                         Value: 103,
  //                       },
  //                       TotalRadiation: {
  //                         Unit: "W/m",
  //                         Value: 274.48,
  //                       },
  //                       AverageRelativeHumidity: {
  //                         Unit: "%",
  //                         Value: 63.69,
  //                       },
  //                       MinRelativeHumidity: {
  //                         Unit: "%",
  //                         Value: 37.4,
  //                       },
  //                       MaxRelativeHumidity: {
  //                         Unit: "%",
  //                         Value: 83.9,
  //                       },
  //                       AverageAtmosphericTemperature: {
  //                         Unit: "°C",
  //                         Value: 30.16,
  //                       },
  //                       MaxAtmosphericTemperature: {
  //                         Unit: "°C",
  //                         Value: 37.97,
  //                       },
  //                       MinAtmosphericTemperature: {
  //                         Unit: "°C",
  //                         Value: 25.74,
  //                       },
  //                       AtmosphericPressure: {
  //                         Unit: "°C",
  //                         Value: 994.56,
  //                       },
  //                       WindVelocity: {
  //                         Unit: "m/s",
  //                         Value: 4.45,
  //                       },
  //                       ETO: {
  //                         Unit: "mm",
  //                         Value: 8.067457,
  //                       },
  //                     },
  //                   ],
  //                   Page: 1,
  //                   TotalItems: 1,
  //                   PageSize: 40,
  //                   TotalPages: 1,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       ...DEFAULT_RESPONSES,
  //     },
  //   },
  // },
  [`${BASE_URL.V1}/equipments/measurements/station/{id}`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get latest station measurements",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Id read",
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
                      type: "object",
                      properties: {
                        IdRead: "number",
                        Time: "string",
                        Hour: "number",
                        IdEquipment: "number",
                        Code: "number",
                        OrganName: "string",
                        Altitude: "number",
                        TotalRadiation: {
                          type: "object",
                          properties: {
                            Unit: "string",
                            Value: "number",
                          },
                        },
                        RelativeHumidity: {
                          type: "object",
                          properties: {
                            Unit: "string",
                            Value: "number",
                          },
                        },
                        AtmosphericTemperature: {
                          type: "object",
                          properties: {
                            Unit: "string",
                            Value: "number",
                          },
                        },
                        WindVelocity: {
                          type: "object",
                          properties: {
                            Unit: "string",
                            Value: "number",
                          },
                        },
                        Et0: {
                          type: "object",
                          properties: {
                            Unit: "string",
                            Value: "number",
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    IdRead: 1,
                    IdEquipment: 1,
                    Time: "2023-11-20T00:00:00.000Z",
                    Hour: null,
                    Altitude: {
                      Unit: "m",
                      Value: 30.4,
                    },
                    TotalRadiation: {
                      Unit: "W/m",
                      Value: 255.68,
                    },
                    AverageRelativeHumidity: {
                      Unit: "%",
                      Value: 74.87,
                    },
                    MinRelativeHumidity: {
                      Unit: "%",
                      Value: 52.41,
                    },
                    MaxRelativeHumidity: {
                      Unit: "%",
                      Value: 87.5,
                    },
                    AverageAtmosphericTemperature: {
                      Unit: "°C",
                      Value: 28.31,
                    },
                    MaxAtmosphericTemperature: {
                      Unit: "°C",
                      Value: 32.97,
                    },
                    MinAtmosphericTemperature: {
                      Unit: "°C",
                      Value: 25.29,
                    },
                    AtmosphericPressure: {
                      Unit: "°C",
                      Value: 1008.94,
                    },
                    WindVelocity: {
                      Unit: "m/s",
                      Value: 3.5,
                    },
                    Et0: {
                      Unit: "mm",
                      Value: 4.911332,
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
    put: {
      tags: TAGS,
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
                TotalRadiation: "number",
                AverageRelativeHumidity: "number",
                MinRelativeHumidity: "number",
                MaxRelativeHumidity: "number",
                AverageAtmosphericTemperature: "number",
                MaxAtmosphericTemperature: "number",
                MinAtmosphericTemperature: "number",
                AtmosphericPressure: "number",
                ETO: "number",
              },
              example: {
                TotalRadiation: 1,
                AverageRelativeHumidity: 11.4,
                MinRelativeHumidity: 11.4,
                MaxRelativeHumidity: 11.4,
                AverageAtmosphericTemperature: 11.4,
                MaxAtmosphericTemperature: 11.4,
                MinAtmosphericTemperature: 11.4,
                AtmosphericPressure: 11.4,
                ETO: 11.4,
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
                  data: "Sucesso ao atualizar leitura de estação 5.",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  // [`${BASE_URL.V1}/equipments/measures/pluviometers`]: {
  //   get: {
  //     tags: TAGS,
  //     security: [BEARER_AUTH],
  //     summary: "Get all pluviometers measures",
  //     description: "List all daily pluviometers measures",
  //     parameters: [
  //       {
  //         name: "idEquipment",
  //         in: "query",
  //         description: "Equipment",
  //         required: true,
  //         schema: {
  //           type: "number",
  //         },
  //       },
  //       {
  //         name: "pageNumber",
  //         in: "query",
  //         description: "Pagination number. Default 1",
  //         required: false,
  //         schema: {
  //           type: "number",
  //         },
  //       },
  //       {
  //         name: "start",
  //         in: "query",
  //         description: "Start date YYYY-MM-DD",
  //         required: false,
  //         schema: {
  //           type: "string",
  //         },
  //       },
  //       {
  //         name: "end",
  //         in: "query",
  //         description: "End date YYYY-MM-DD",
  //         required: false,
  //         schema: {
  //           type: "string",
  //         },
  //       },
  //     ],
  //     responses: {
  //       200: {
  //         description: "Daily pluviometers measures",
  //         content: {
  //           "application/json": {
  //             schema: {
  //               type: "object",
  //               items: {
  //                 type: "object",
  //                 properties: {
  //                   data: {
  //                     type: "object",
  //                     items: {
  //                       type: "array",
  //                       items: {
  //                         type: "object",
  //                         properties: {
  //                           Date: "number",
  //                           IdRead: "number",
  //                           IdEquipment: "number",
  //                           Code: "number",
  //                           Name: "string",
  //                           Measures: {
  //                             type: "object",
  //                             properties: {
  //                               Precipitation: {
  //                                 type: "object",
  //                                 properties: {
  //                                   Unit: "string",
  //                                   Value: "number",
  //                                 },
  //                               },
  //                             },
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //               example: {
  //                 data: {
  //                   Items: [
  //                     {
  //                       IdRead: 1,
  //                       Time: "2023-09-11",
  //                       Hour: null,
  //                       Precipitation: {
  //                         Unit: "mm",
  //                         Value: 12,
  //                       },
  //                     },
  //                   ],
  //                   TotalItems: 6,
  //                   Page: 1,
  //                   PageSize: 40,
  //                   TotalPages: 1,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       ...DEFAULT_RESPONSES,
  //     },
  //   },
  // },
  [`${BASE_URL.V1}/equipments/measurements/pluviometer/{id}`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get latest pluviometer measurements",
      parameters: [
        {
          name: "id",
          in: "query",
          description: "Id read",
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
                      type: "object",
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            Date: "number",
                            IdRead: "number",
                            IdEquipment: "number",
                            Code: "number",
                            Name: "string",
                            Precipitation: {
                              type: "object",
                              properties: {
                                Unit: "string",
                                Value: "number",
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
                    IdRead: 1,
                    IdEquipment: 5,
                    Time: "2023-11-20T00:00:00.000Z",
                    Hour: null,
                    Precipitation: {
                      Unit: "mm",
                      Value: 0,
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
    put: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Update pluviometer measures",
      parameters: [
        {
          name: "id",
          in: "query",
          description: "Id read",
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
                  data: "Sucesso ao atualizar leitura de pluviômetro 1.",
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

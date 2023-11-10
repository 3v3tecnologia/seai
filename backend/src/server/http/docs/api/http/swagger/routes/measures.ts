import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["Equipments Measures"];

export const MEASURES = {
  [`${BASE_URL.V1}/equipments/measures/stations`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get all stations measures",
      description: "List all daily stations measures",
      parameters: [
        {
          name: "idEquipment",
          in: "query",
          description: "Equipment",
          required: true,
          schema: {
            type: "number",
          },
        },
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
          name: "start",
          in: "query",
          description: "Start date YYYY-MM-DD",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "end",
          in: "query",
          description: "End date YYYY-MM-DD",
          required: false,
          schema: {
            type: "string",
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
                            IdRead: "number",
                            Time: "string",
                            Hour: "number",
                            IdEquipment: "number",
                            Code: "number",
                            OrganName: "string",
                            Altitude: "number",
                            Measures: {
                              type: "object",
                              properties: {
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
                                ETO: {
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
                  },
                },
                example: {
                  data: {
                    Measures: [
                      {
                        IdRead: 78,
                        Time: "2023-11-05",
                        Hour: null,
                        Altitude: {
                          Unit: "m",
                          Value: 103,
                        },
                        TotalRadiation: {
                          Unit: "W/m",
                          Value: 274.48,
                        },
                        AverageRelativeHumidity: {
                          Unit: "%",
                          Value: 63.69,
                        },
                        MinRelativeHumidity: {
                          Unit: "%",
                          Value: 37.4,
                        },
                        MaxRelativeHumidity: {
                          Unit: "%",
                          Value: 83.9,
                        },
                        AverageAtmosphericTemperature: {
                          Unit: "°C",
                          Value: 30.16,
                        },
                        MaxAtmosphericTemperature: {
                          Unit: "°C",
                          Value: 37.97,
                        },
                        MinAtmosphericTemperature: {
                          Unit: "°C",
                          Value: 25.74,
                        },
                        AtmosphericPressure: {
                          Unit: "°C",
                          Value: 994.56,
                        },
                        WindVelocity: {
                          Unit: "m/s",
                          Value: 4.45,
                        },
                        ETO: {
                          Unit: "mm",
                          Value: 8.067457,
                        },
                      },
                    ],
                    PageNumber: 0,
                    QtdRows: 3,
                    PageLimitRows: 40,
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
  },
  [`${BASE_URL.V1}/equipments/measures/pluviometers`]: {
    get: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Get all pluviometers measures",
      description: "List all daily pluviometers measures",
      parameters: [
        {
          name: "idEquipment",
          in: "query",
          description: "Equipment",
          required: true,
          schema: {
            type: "number",
          },
        },
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
          name: "start",
          in: "query",
          description: "Start date YYYY-MM-DD",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "end",
          in: "query",
          description: "End date YYYY-MM-DD",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Daily pluviometers measures",
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
                            Measures: {
                              type: "object",
                              properties: {
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
                  },
                },
                example: {
                  data: {
                    Measures: [
                      {
                        IdRead: 1,
                        Time: "2023-10-30T00:00:00.000Z",
                        Hour: null,
                        IdEquipment: 2,
                        Code: null,
                        Name: "Pluviometro - Itaperi",
                        Organ: "FUNCEME",
                        Measures: {
                          Precipitation: {
                            Unit: "mm",
                            Value: 33,
                          },
                        },
                      },
                    ],
                    PageNumber: 0,
                    QtdRows: 1,
                    PageLimitRows: 30,
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

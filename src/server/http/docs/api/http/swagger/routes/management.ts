import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = ["Management"];

export const MEASURES = {
  [`${BASE_URL.V1}/management/crop`]: {
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
                      id: 3,
                      name: "ALFACE",
                      locationName: "FORTALEZA",
                    },
                    {
                      id: 4,
                      name: "FEIJÃO",
                      locationName: "FORTALEZA",
                    },
                    {
                      id: 2,
                      name: "LIMÃO",
                      locationName: "FORTALEZA",
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
  [`${BASE_URL.V1}/management/crop/{id}`]: {
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
                    ETO: {
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
};

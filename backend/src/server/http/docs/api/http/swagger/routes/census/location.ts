import { BASE_URL } from "../../commons/baseURL";
import { BEARER_AUTH } from "../../commons/security";
import { DEFAULT_RESPONSES } from "./../../commons/status";

export const LOCATION = {
  [`${BASE_URL.V1}/census/locations`]: {
    get: {
      tags: ["Census"],
      summary: "Get all basins and cities",
      description: "List Basins and Cities",
      security: [BEARER_AUTH],
      responses: {
        200: {
          description: "List all locations",
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
                            Id: "number",
                            Local: "string",
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Bacia: [
                      {
                        Id: 1,
                        Local: "Acopiara",
                      },
                    ],
                    Municipios: [
                      {
                        Id: 1,
                        Local: "Aiuaba",
                        IdBacia: 1,
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

import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";
import { BASE_URL } from "../commons/baseURL";

const TAGS = ["Background Jobs"];

export const NEWSLETTER = {
  [`${BASE_URL.V1}/jobs`]: {
    get: {
      tags: TAGS,
      summary: "Get jobs",
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
          name: "queue",
          in: "query",
          description: "Job name",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "id",
          in: "query",
          description: "Job ID (UUID)",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "state",
          in: "query",
          description: "Jobs states available in pb_boss",
          required: false,
          schema: {
            type: "string",
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
                      Data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: "string",
                            name: "string",
                            priority: 1,
                            data: "object",
                            state: "completed",
                            retrylimit: "number",
                            retrycount: "number",
                            retrydelay: "number",
                            retrybackoff: "boolean",
                            startafter: "string",
                            startedon: "string",
                            expirein: {
                              minutes: "number",
                            },
                            createdon: "string",
                            completedon: "string",
                            keepuntil: "string",
                            on_complete: "boolean",
                            output: "object",
                          },
                        },
                      },
                      Pagination: {
                        type: "object",
                        properties: {
                          PageLimitRows: "number",
                          PageNumber: "number",
                          QtdRows: "number",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Data: [
                      {
                        id: "96a9c298-4662-4972-a4ed-1399c5387ed1",
                        name: "send-newsletter",
                        priority: 1,
                        data: {
                          id: 2,
                        },
                        state: "completed",
                        retrylimit: 23,
                        retrycount: 0,
                        retrydelay: 40,
                        retrybackoff: false,
                        startafter: "2024-01-11T12:21:27.005Z",
                        startedon: "2024-01-11T12:21:31.127Z",
                        expirein: {
                          minutes: 15,
                        },
                        createdon: "2024-01-11T12:21:27.005Z",
                        completedon: "2024-01-11T12:21:33.751Z",
                        keepuntil: "2024-01-25T12:21:27.005Z",
                        on_complete: false,
                        output: null,
                      },
                    ],
                    Pagination: {
                      PageLimitRows: 50,
                      PageNumber: 1,
                      QtdRows: 1,
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
    post: {
      tags: TAGS,
      security: [BEARER_AUTH],
      summary: "Create job",
      description: "Create a job ",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: "string",
                priority: "number",
                retryLimit: "number",
                retryDelay: "number",
                startAfter: "string",
                data: {
                  type: "object",
                },
              },
              example: {
                name: "send-newsletter",
                priority: 1,
                retryLimit: 23,
                retryDelay: 40,
                data: null,
                startAfter: "2024-01-11 18:21:33.751 -0300",
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
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      id: "string",
                      name: "string",
                      priority: "number",
                      data: "object",
                      state: "string",
                      retrylimit: "number",
                      retrycount: "number",
                      retrydelay: "number",
                      retrybackoff: "boolean",
                      startafter: "string",
                      startedon: "string",
                      singletonkey: "string",
                      singletonon: "string",
                      expirein: {
                        minutes: "number",
                      },
                      createdon: "string",
                      completedon: "string",
                      keepuntil: "string",
                      on_complete: "boolean",
                      output: "object",
                    },
                  },
                },
                example: {
                  data: {
                    id: "d86b95c0-4fc4-489e-80dd-634675695b6c",
                    name: "send-newsletter",
                    priority: 1,
                    data: {
                      id: 2,
                    },
                    state: "created",
                    retrylimit: 23,
                    retrycount: 0,
                    retrydelay: 40,
                    retrybackoff: false,
                    startafter: "2024-01-11T21:21:33.751Z",
                    startedon: null,
                    singletonkey: null,
                    singletonon: null,
                    expirein: {
                      minutes: 15,
                    },
                    createdon: "2024-01-11T14:58:18.387Z",
                    completedon: null,
                    keepuntil: "2024-01-25T14:58:18.387Z",
                    on_complete: false,
                    output: null,
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
      summary: "Update job",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Job UUID",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: "string",
                priority: "number",
                retryLimit: "number",
                retryDelay: "number",
                startAfter: "string",
                data: {
                  type: "object",
                },
              },
              example: {
                name: "send-newsletter",
                priority: 1,
                retryLimit: 23,
                retryDelay: 40,
                data: null,
                startAfter: "2024-01-11 18:21:33.751 -0300",
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
                  data: "Sucesso ao atualizar job d86b95c0-4fc4-489e-80dd-634675695b6c",
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
      summary: "Delete job",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Job id",
          required: true,
          schema: {
            type: "string",
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
                  data: "Sucesso ao deletar job 9142f7ee-4679-40a4-bb94-b6e3d3681219",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/jobs/schedule`]: {
    get: {
      tags: TAGS,
      summary: "Get news by ID",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "path",
          description: "News Id",
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
                      Data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            Id: "number",
                            Author: {
                              type: "object",
                              properties: {
                                Id: "number",
                                Email: "string",
                                Organ: "string",
                              },
                            },
                            Title: "string",
                            Data: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  type: "string",
                                  data: {
                                    type: "array",
                                    items: {
                                      type: "number",
                                    },
                                  },
                                },
                              },
                            },
                            Description: "string",
                            CreatedAt: "string",
                            UpdatedAt: "string",
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    Id: 4,
                    Author: {
                      Id: 1,
                      Email: "testSender@gmail.com",
                      Organ: "FUNCEME",
                    },
                    Title: "TESTINHO",
                    Description: "Testinho",
                    CreatedAt: "2023-12-12T11:24:24.600Z",
                    UpdatedAt: "2023-12-12T11:24:24.600Z",
                    Data: {
                      type: "Buffer",
                      data: [
                        100, 97, 116, 97, 58, 116, 101, 120, 116, 47, 104, 116,
                        109, 108, 59, 99, 104, 97, 114, 115, 101, 116, 61, 117,
                        116, 102, 45, 56, 59, 98, 97, 115, 101, 54, 52, 44, 67,
                        105, 65, 103, 73, 67, 65, 56, 97, 68, 69, 43, 77, 49,
                        89, 122, 73, 70, 86, 83, 84, 68, 119, 118, 97, 68, 69,
                        43, 67, 105, 65, 103, 73, 67, 65, 56, 89, 83, 66, 111,
                        99, 109, 86, 109, 80, 87, 104, 48, 100, 72, 65, 54, 76,
                        121, 57, 122, 98, 50, 90, 48, 100, 50, 70, 121, 90, 83,
                        52, 122, 100, 106, 77, 117, 90, 109, 70, 121, 98, 84,
                        53, 87, 97, 88, 78, 112, 100, 71, 85, 103, 89, 83, 66,
                        122, 98, 50, 90, 48, 100, 50, 70, 121, 90, 84, 119, 118,
                        89, 84, 52, 75,
                      ],
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
};

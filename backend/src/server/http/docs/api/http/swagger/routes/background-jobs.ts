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
  [`${BASE_URL.V1}/jobs/states`]: {
    get: {
      tags: TAGS,
      summary: "Get jobs states",
      security: [BEARER_AUTH],
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
                      type: "array",
                    },
                  },
                },
                example: {
                  data: [
                    "created",
                    "retry",
                    "active",
                    "completed",
                    "expired",
                    "cancelled",
                    "failed",
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
  [`${BASE_URL.V1}/jobs/schedule`]: {
    get: {
      tags: TAGS,
      summary: "Get cron jobs",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "id",
          in: "query",
          description: "Job id",
          required: true,
          schema: {
            type: "number",
          },
        },
        {
          name: "pageNumber",
          in: "query",
          description: "Page",
          required: true,
          schema: {
            type: "number",
          },
        },
        {
          name: "limit",
          in: "query",
          description: "Limit of rows",
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
                    Data: [
                      {
                        name: "funceme-etl",
                        cron: "0 0 0 0 0",
                        timezone: null,
                        data: null,
                        options: {
                          priority: 1,
                          retryDelay: 40,
                          retryLimit: 23,
                        },
                        created_on: "2023-12-13T19:17:00.254Z",
                        updated_on: "2024-01-11T12:36:52.674Z",
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
      summary: "Create cron job",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: "string",
                cron: "string",
                data: {
                  type: "object",
                },
                options: {
                  priority: "number",
                  retryLimit: "number",
                  retryDelay: "number",
                },
              },
              example: {
                name: "send-newsletter2",
                cron: "0 0 0 0 0",
                data: {
                  id: 1,
                },
                options: {
                  priority: 1,
                  retryLimit: 23,
                  retryDelay: 40,
                },
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
                    type: "string",
                  },
                },
                example: {
                  data: "Sucesso ao criar cron para a fila send-newsletter2",
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
      summary: "Update cron job",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "name",
          in: "path",
          description: "Cron job name",
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
                cron: "string",
                data: {
                  type: "object",
                },
                options: {
                  priority: "number",
                  retryLimit: "number",
                  retryDelay: "number",
                },
              },
              example: {
                name: "send-newsletter2",
                cron: "0 0 0 0 0",
                data: {
                  id: 1,
                },
                options: {
                  priority: 1,
                  retryLimit: 23,
                  retryDelay: 40,
                },
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
                  data: "Sucesso ao atualizar cron.",
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
      summary: "Delete cron job",
      security: [BEARER_AUTH],
      parameters: [
        {
          name: "name",
          in: "path",
          description: "Cron job name",
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
};

import { BASE_URL } from "../commons/baseURL";
import { BEARER_AUTH } from "../commons/security";
import { DEFAULT_RESPONSES } from "../commons/status";

const TAGS = {
  CATEGORY: ["FAQ CATEGORY"],
  FAQ: ["FAQ"],
};

const CATEGORY = {
  [`${BASE_URL.V1}/faq/category/create`]: {
    post: {
      tags: TAGS.CATEGORY,
      security: [BEARER_AUTH],
      summary: "Create a Category",
      description: "Create a new category",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
              },
              example: {
                title: "categoria 1",
                description: "descrição da categoria 1",
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Category created successfully",
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
                  data: "Categoria criada com sucesso",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/faq/category/delete/{id}`]: {
    delete: {
      tags: TAGS.CATEGORY,
      security: [BEARER_AUTH],
      summary: "Delete category by id",
      description: "Delete FAQ category by id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Category Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Category created successfully",
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
                  data: "Categoria deletada com sucesso",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/faq/category/list`]: {
    get: {
      tags: TAGS.CATEGORY,
      security: [BEARER_AUTH],
      summary: "Get categories",
      description: "Get all categories",
      responses: {
        200: {
          description: "Get all categories",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: "number",
                          title: "string",
                          description: "string",
                          created_at: "string",
                          updated_at: "string",
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      id: 1,
                      title: "Test2",
                      description: "test",
                      created_at: "2023-07-04T11:40:26.459Z",
                      updated_at: "2023-07-04T11:40:26.459Z",
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
  [`${BASE_URL.V1}/faq/category/update`]: {
    put: {
      tags: TAGS.CATEGORY,
      security: [BEARER_AUTH],
      summary: "Update a Category",
      description: "Update a category",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "number",
                },
                title: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
              },
              example: {
                id: 1,
                title: "categoria 1",
                description: "descrição da categoria 1",
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Category updated successfully",
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
                  data: "Categoria atualizada sucesso",
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

const FAQ = {
  [`${BASE_URL.V1}/faq/create`]: {
    post: {
      tags: TAGS.FAQ,
      security: [BEARER_AUTH],
      summary: "Create a FAQ question",
      description: "Create FAQ with question and answer",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                },
                answer: {
                  type: "string",
                },
                order: {
                  type: "number",
                },
                categories: {
                  type: "array",
                  items: {
                    type: "number",
                  },
                },
              },
              example: {
                question: "O que é TDD?",
                answer: "Test-Driven Development",
                order: 1,
                categories: [2, 3, 4],
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "FAQ created successfully",
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
                  data: "Faq criado com sucesso",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/faq/update`]: {
    put: {
      tags: TAGS.FAQ,
      security: [BEARER_AUTH],
      summary: "Update a FAQ question",
      description: "Update FAQ with question, answer",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "number",
                },
                question: {
                  type: "string",
                },
                answer: {
                  type: "string",
                },
                order: {
                  type: "number",
                },
                categories: {
                  type: "array",
                  items: {
                    type: "number",
                  },
                },
              },
              example: {
                question: "O que é TDD?",
                answer: "Test-Driven Development",
                order: 1,
                categories: [2, 3, 4],
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "FAQ created successfully",
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
                  data: "Faq atualizado com sucesso",
                },
              },
            },
          },
        },
        ...DEFAULT_RESPONSES,
      },
    },
  },
  [`${BASE_URL.V1}/faq/get/{id}`]: {
    get: {
      tags: TAGS.FAQ,
      security: [BEARER_AUTH],
      summary: "Get FAQ by id",
      description: "Get FAQ by id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Faq Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Get FAQ by id",
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
                        id: "number",
                        question: "string",
                        answer: "string",
                        order: "number",
                        description: "string",
                        created_at: "string",
                        updated_at: "string",
                        categories: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: "number",
                              title: "string",
                              description: "string",
                              created_at: "string",
                              updated_at: "string",
                            },
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: {
                    id: 1,
                    question: "O que é TDD",
                    answer: "Desenvolvimento orientado a testes",
                    order: 1,
                    created_at: "2023-07-04T11:39:50.085Z",
                    updated_at: "2023-07-04T11:39:50.085Z",
                    categories: [
                      {
                        id: 2,
                        title: "Práticas",
                        description: "teste",
                        created_at: "2023-07-04T11:40:26.459Z",
                        updated_at: "2023-07-04T11:40:26.459Z",
                      },
                      {
                        id: 3,
                        title: "Geral",
                        description: "teste",
                        created_at: "2023-07-04T11:40:26.462Z",
                        updated_at: "2023-07-04T11:40:26.462Z",
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
  [`${BASE_URL.V1}/faq/list`]: {
    get: {
      tags: TAGS.FAQ,
      security: [BEARER_AUTH],
      summary: "Get FAQs with categories",
      description: "Get FAQs with categories",
      responses: {
        200: {
          description: "Get all FAQs",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: "number",
                          question: "string",
                          answer: "string",
                          order: "number",
                          description: "string",
                          created_at: "string",
                          updated_at: "string",
                          categories: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: "number",
                                title: "string",
                                description: "string",
                                created_at: "string",
                                updated_at: "string",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      id: 1,
                      question: "O que é TDD",
                      answer: "Desenvolvimento orientado a testes",
                      order: 1,
                      created_at: "2023-07-04T11:39:50.085Z",
                      updated_at: "2023-07-04T11:39:50.085Z",
                      categories: [
                        {
                          id: 2,
                          title: "Práticas",
                          description: "teste",
                          created_at: "2023-07-04T11:40:26.459Z",
                          updated_at: "2023-07-04T11:40:26.459Z",
                        },
                        {
                          id: 3,
                          title: "Geral",
                          description: "teste",
                          created_at: "2023-07-04T11:40:26.462Z",
                          updated_at: "2023-07-04T11:40:26.462Z",
                        },
                      ],
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
  [`${BASE_URL.V1}/faq/list-by-category/{id}`]: {
    get: {
      tags: TAGS.FAQ,
      security: [BEARER_AUTH],
      summary: "Get all FAQs by category id",
      description:
        "Get all FAQs by category id, returning data with categories in response",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Category Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Get all FAQs by category id",
          content: {
            "application/json": {
              schema: {
                type: "object",
                items: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: "number",
                          question: "string",
                          answer: "string",
                          order: "number",
                          description: "string",
                          created_at: "string",
                          updated_at: "string",
                          categories: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: "number",
                                title: "string",
                                description: "string",
                                created_at: "string",
                                updated_at: "string",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      id: 1,
                      question: "O que é TDD",
                      answer: "Desenvolvimento orientado a testes",
                      order: 1,
                      created_at: "2023-07-04T11:39:50.085Z",
                      updated_at: "2023-07-04T11:39:50.085Z",
                      categories: [
                        {
                          id: 2,
                          title: "Práticas",
                          description: "teste",
                          created_at: "2023-07-04T11:40:26.459Z",
                          updated_at: "2023-07-04T11:40:26.459Z",
                        },
                        {
                          id: 3,
                          title: "Geral",
                          description: "teste",
                          created_at: "2023-07-04T11:40:26.462Z",
                          updated_at: "2023-07-04T11:40:26.462Z",
                        },
                      ],
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
  [`${BASE_URL.V1}/faq/delete/{id}`]: {
    delete: {
      tags: TAGS.FAQ,
      security: [BEARER_AUTH],
      summary: "Delete faq by  id",
      description: "Delete faq by id",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Faq Id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Category created successfully",
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
                  data: "Faq deletado com sucesso",
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

export const FAQ_ROUTES = {
  ...CATEGORY,
  ...FAQ,
};

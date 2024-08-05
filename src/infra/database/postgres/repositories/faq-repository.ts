import { FaqRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/faq-repository";
import {
  FaqCategoriesData,
  FaqWithCategoriesData,
} from "../../../../domain/use-cases/_ports/repositories/models/faqData";
import {
  IOutputWithPagination,
  IPaginationInput,
  toPaginatedOutput,
} from "../../../../domain/use-cases/helpers/pagination";
import { UserCommandOperationProps } from "../../../../modules/Logs/protocols/logger";
import { governmentDb, logsDb } from "../connection/knexfile";

export class DbFaqRepository implements FaqRepositoryProtocol {
  async addFaq(
    data: {
      question: string;
      answer: string;
      category_id: number;
    },
    accountId: number
  ): Promise<number | null> {
    const { question, answer, category_id } = data;

    let faq_id: number | null = null;

    await governmentDb.transaction(async function (trx) {
      const response = await trx
        .withSchema("faq")
        .insert({
          Question: question,
          Answer: answer,
          Fk_Category: category_id,
          CreatedAt: governmentDb.fn.now(),
        })
        .returning("Id")
        .into("FAQ");

      const id = response[0].Id;

      faq_id = id;
    });

    await logsDb
      .insert({
        User_Id: accountId,
        Resource: "faq",
        Operation: "create",
        Description: "Criação de faq",
      })
      .withSchema("users")
      .into("Operations");

    return faq_id;
  }

  async getFaqs(
    params: {
      question?: string;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<FaqWithCategoriesData>> {
    const { question, pageNumber, limit, offset } = params;

    const table = "FAQ AS faq";

    const countQuery = governmentDb(table)
      .withSchema("faq")
      .innerJoin("Category as cat", "cat.Id", "faq.Fk_Category");

    const fetchFaqsColumnsQuery = governmentDb(table)
      .withSchema("faq")
      .select("faq.*", "cat.Id as IdCategory", "cat.Title", "cat.Description")
      .innerJoin("Category as cat", "cat.Id", "faq.Fk_Category");

    if (question) {
      const filter = `to_tsvector('simple', coalesce(faq.\"Question\", '')) @@ to_tsquery('simple', '${question}:*')`;
      fetchFaqsColumnsQuery.whereRaw(filter);
      countQuery.whereRaw(filter);
    }

    const totalCountReponse = await countQuery.count();

    const totalCount = Number(totalCountReponse[0].count);

    const faqsRows = await fetchFaqsColumnsQuery.limit(limit).offset(offset);

    if (!faqsRows) {
      return null;
    }

    const faqsToDomain: Array<FaqWithCategoriesData> = faqsRows.map(
      (row: any) => ({
        id: row.Id,
        question: row.Question,
        answer: row.Answer,
        created_at: row.CreatedAt,
        updated_at: row.UpdatedAt,
        category: {
          id: row.IdCategory,
          title: row.Title,
          description: row.Description,
        },
      })
    );

    return toPaginatedOutput({
      data: faqsToDomain,
      page: pageNumber,
      count: totalCount,
      limit,
    });
  }

  async updateFaq(
    data: {
      id: number;
      question: string;
      answer: string;
      category_id: number;
    },
    operation: UserCommandOperationProps
  ): Promise<void> {
    const { id, question, answer, category_id } = data;

    await governmentDb("FAQ")
      .withSchema("faq")
      .update(
        {
          Question: question,
          Answer: answer,
          Fk_Category: category_id,
          UpdatedAt: governmentDb.fn.now(),
        },
        ["Id"]
      )
      .where({ Id: id });

    await logsDb
      .insert({
        User_Id: operation.author,
        Resource: "faq",
        Operation: "update",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }

  async deleteFaqById(
    id_faq: number,
    operation: UserCommandOperationProps
  ): Promise<number | null> {
    const response = await governmentDb("FAQ")
      .withSchema("faq")
      .where("Id", id_faq)
      .del()
      .returning("Id");

    if (response.length > 0) {
      const deleteFaqId = response[0];
      console.log(`FAQ com ID ${deleteFaqId.Id} deletado com sucesso.`);

      await logsDb
        .insert({
          User_Id: operation.author,
          Resource: "faq",
          Operation: "delete",
          Description: operation.operation,
        })
        .withSchema("users")
        .into("Operations");

      return Number(deleteFaqId);
    }

    console.log("Não foi possível encontrar faq");

    return null;
  }

  async getFaqById(id_faq: number): Promise<FaqWithCategoriesData | null> {
    const faqDbResult = await governmentDb
      .withSchema("faq")
      .select(
        "faq.Id as Id_Faq",
        "faq.Question",
        "faq.Answer",
        "faq.CreatedAt",
        "faq.UpdatedAt",
        "cat.Id as IdCategory",
        "cat.Title",
        "cat.Description"
      )
      .innerJoin("Category as cat", "cat.Id", "faq.Fk_Category")
      .whereRaw(`faq."Id" = ?`, id_faq)
      .from("FAQ as faq")
      .first();

    if (!faqDbResult) {
      return null;
    }

    return {
      id: faqDbResult.Id,
      question: faqDbResult.Question,
      answer: faqDbResult.Answer,
      created_at: faqDbResult.CreatedAt,
      updated_at: faqDbResult.UpdatedAt,
      category: {
        id: faqDbResult.IdCategory,
        title: faqDbResult.Title,
        description: faqDbResult.Description,
      },
    };
  }

  async checkIfQuestionAlreadyExists(question: string): Promise<boolean> {
    const exists = await governmentDb
      .withSchema("faq")
      .select("*")
      .from("FAQ")
      .where({ Question: question })
      .first();

    return exists ? true : false;
  }

  async checkIfFaqAlreadyExists(id: number): Promise<boolean> {
    const exists = await governmentDb
      .withSchema("faq")
      .select("*")
      .from("FAQ")
      .where({ Id: id })
      .first();

    return exists ? true : false;
  }

  async getFagsByCategory(
    params: {
      id_category: number;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<FaqWithCategoriesData>> {
    const { pageNumber, limit, offset, id_category } = params;

    // const baseQuery = governmentDb
    //   .innerJoin("Category as cat", "cat.Id", "faq.Fk_Category")
    //   .from("FAQ as faq")
    //   .where({ Fk_Category: id_category })

    const totalCountReponse = await governmentDb
      .withSchema("faq")
      .innerJoin("Category as cat", "cat.Id", "faq.Fk_Category")
      .from("FAQ as faq")
      .where({ Fk_Category: id_category })
      .count();

    const totalCount = Number(totalCountReponse[0].count);

    const faqsRows = await governmentDb
      .withSchema("faq")
      .select("faq.*", "cat.Id as IdCategory", "cat.Title", "cat.Description")
      .innerJoin("Category as cat", "cat.Id", "faq.Fk_Category")
      .from("FAQ as faq")
      .where({ Fk_Category: id_category })
      .limit(limit)
      .offset(offset);

    const toDomain: Array<FaqWithCategoriesData> = faqsRows.map(
      (faqDbResult) => ({
        id: faqDbResult.Id,
        question: faqDbResult.Question,
        answer: faqDbResult.Answer,
        created_at: faqDbResult.CreatedAt,
        updated_at: faqDbResult.UpdatedAt,
        category: {
          id: faqDbResult.IdCategory,
          title: faqDbResult.Title,
          description: faqDbResult.Description,
        },
      })
    );

    return toPaginatedOutput({
      data: toDomain,
      page: pageNumber,
      count: totalCount,
      limit,
    });
  }

  async deleteCategoryById(
    id_category: number,
    operation: UserCommandOperationProps
  ): Promise<number | null> {
    const response = await governmentDb("faq.Category")
      .where("Id", id_category)
      .del()
      .returning("Id");

    if (response.length > 0) {
      const deleteFaqId = response[0];
      console.log(`Categoria com ID ${deleteFaqId} deletada com sucesso.`);

      await logsDb
        .insert({
          User_Id: operation.author,
          Resource: "faq-category",
          Operation: "delete",
          Description: operation.operation,
        })
        .withSchema("users")
        .into("Operations");

      return Number(deleteFaqId);
    }

    console.log("Não foi possível encontrar categoria");

    return null;
  }

  async updateCategory(
    {
      description,
      id_category,
      title,
    }: {
      id_category: number;
      title: string;
      description: string;
    },
    operation: UserCommandOperationProps
  ): Promise<void> {
    await governmentDb("faq.Category")
      .update({
        Title: title,
        Description: description,
        UpdatedAt: governmentDb.fn.now(),
      })
      .where("Id", id_category);

    await logsDb
      .insert({
        User_Id: operation.author,
        Resource: "faq-category",
        Operation: "update",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }

  async addCategory(
    title: string,
    description: string,
    accountId: number
  ): Promise<number> {
    const response = await governmentDb
      .withSchema("faq")
      .insert({
        Title: title,
        Description: description,
        CreatedAt: governmentDb.fn.now(),
      })
      .returning("Id")
      .into("Category");

    await logsDb
      .insert({
        User_Id: accountId,
        Resource: "faq-category",
        Operation: "create",
        Description: "Criação de categoria",
      })
      .withSchema("users")
      .into("Operations");

    return response[0].Id;
  }
  async getCategories(): Promise<Array<FaqCategoriesData> | null> {
    const categories = await governmentDb
      .withSchema("faq")
      .select("*")
      .from("Category");

    if (categories.length) {
      return categories.map((category) => ({
        id: category.Id,
        title: category.Title,
        description: category.Description,
        created_at: category.CreatedAt,
        updated_at: category.UpdatedAt,
      }));
    }

    return null;
  }

  async checkIfCategoryIsAlreadyAssociated(
    category_id: number
  ): Promise<boolean> {
    const response = await governmentDb("FAQ as f")
      .withSchema("faq")
      .select(
        governmentDb.raw(
          'CASE WHEN f."Fk_Category" = ? THEN true ELSE false END AS result',
          [category_id]
        )
      )
      .first();

    return response ? response.result : false;
  }
  async getCategoryById(
    id_category: number
  ): Promise<FaqCategoriesData | null> {
    const category = await governmentDb
      .withSchema("faq")
      .select("*")
      .where({ Id: id_category })
      .from("Category")
      .first();

    if (category) {
      return {
        id: category.Id,
        title: category.Title,
        description: category.Description,
        created_at: category.CreatedAt,
        updated_at: category.UpdatedAt,
      };
    }
    return null;
  }

  async getCategoryByTitle(title: string): Promise<FaqCategoriesData | null> {
    const category = await governmentDb
      .withSchema("faq")
      .select("*")
      .where({ Title: title })
      .from("Category")
      .first();

    if (category) {
      return {
        id: category.Id,
        title: category.Title,
        description: category.Description,
        created_at: category.CreatedAt,
        updated_at: category.UpdatedAt,
      };
    }
    return null;
  }
}

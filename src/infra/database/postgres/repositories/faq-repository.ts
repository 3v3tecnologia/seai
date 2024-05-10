import {
  CategoryRepository,
  FaqRepository,
  FaqRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/faq-repository";
import { IOutputWithPagination, IPaginationInput, toPaginatedOutput } from "../../../../domain/use-cases/helpers/pagination";
import { governmentDb } from "../connection/knexfile";

export class DbFaqRepository implements FaqRepositoryProtocol {
  async add(data: {
    question: string;
    answer: string;
    order: number;
    category_id: number;
  }): Promise<number | null> {
    const { question, answer, order, category_id } = data;

    let faq_id: number | null = null;

    await governmentDb.transaction(async function (trx) {
      const response = await trx
        .insert({
          Question: question,
          Answer: answer,
          Order: order,
          CreatedAt: governmentDb.fn.now(),
        })
        .returning("Id")
        .into("FAQ");

      const id = response[0].Id;


      await trx
        .insert({
          Fk_FAQ: id,
          Fk_Category: category_id,
        })
        .into("FAQ_Category");

      faq_id = id
    });

    return faq_id;
  }

  async updateCategory(
    id_category: number,
    title: string,
    description: string
  ): Promise<void> {
    await governmentDb("Category")
      .update({
        Title: title,
        Description: description,
        UpdatedAt: governmentDb.fn.now(),
      })
      .returning("Id")
      .where("Id", id_category);
  }

  async addCategory(title: string, description: string): Promise<number> {
    const response = await governmentDb
      .insert({
        Title: title,
        Description: description,
        CreatedAt: governmentDb.fn.now(),
      })
      .returning("Id")
      .into("Category");

    return response[0].Id
  }

  async loadAll(params: {
    question?: string
  } & IPaginationInput): Promise<IOutputWithPagination<FaqRepository.FaqWithCategoriesModel>> {
    const { question, pageNumber, limit, offset, } = params

    const table = "FAQ AS faq"

    const fetchFaqsQuery = governmentDb(table).select("faq.*", "cat.Id as IdCategory", "cat.Title", "cat.Description");
    const fetchFaqsCountQuery = governmentDb(table);

    if (question) {
      const filter = `to_tsvector('simple', coalesce(faq.\"Question\", '')) @@ to_tsquery('simple', '${question}:*')`
      fetchFaqsQuery.whereRaw(filter)
      fetchFaqsCountQuery.whereRaw(filter)
    }

    const totalCountReponse = await fetchFaqsCountQuery.count()


    const totalCount = Number(totalCountReponse[0].count)

    const faqsRows = await fetchFaqsQuery
      .innerJoin("Category as cat", "cat.Id", "faq.Fk_Category")
      .limit(limit)
      .offset(offset)

    if (!faqsRows) {
      return null;
    }

    const faqsToDomain: Array<FaqRepository.FaqWithCategoriesModel> =
      faqsRows.map((row: any) => ({
        id: row.Id,
        question: row.Question,
        answer: row.Answer,
        order: row.Order,
        created_at: row.CreatedAt,
        updated_at: row.UpdatedAt,
        category: {
          id: row.IdCategory,
          title: row.Title,
          description: row.Description
        },
      }));

    // TO-DO: refactor
    // await Promise.allSettled(
    //   faqsToDomain.map(async (faq) => {
    //     const categories = await this.loadCategoriesByFaqId(faq.id);
    //     console.log(categories);
    //     faq.categories = categories || [];
    //     return faq;
    //   })
    // );

    return toPaginatedOutput({
      data: faqsToDomain,
      page: pageNumber,
      count: totalCount,
      limit,
    });
  }

  async loadCategoriesByFaqId(
    id: number
  ): Promise<Array<CategoryRepository.FaqCategoriesData> | null> {
    const categories = await governmentDb
      .select("*")
      .from("FAQ_Category")
      .innerJoin("Category", "Category.Id", "FAQ_Category.Fk_Category")
      .where({ Fk_FAQ: id });

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
  async update(data: {
    id: number;
    question: string;
    answer: string;
    order: number;
    category_id: number;
  }): Promise<void> {
    const { id, question, answer, order, categories } = data;

    await governmentDb.transaction(async function (trx) {
      await trx("FAQ")
        .update(
          {
            Question: question,
            Answer: answer,
            Order: order,
            Fk_Category: category_id,
            UpdatedAt: governmentDb.fn.now(),
          },
          ["Id"]
        )
        .where({ Id: id });

      // await trx("FAQ_Category").where("Fk_FAQ", id).del();

      // const categoriesToPersist = categories.map((category_id) => ({
      //   Fk_FAQ: id,
      //   Fk_Category: category_id,
      // }))

      // await trx
      //   .insert(categoriesToPersist)
      //   .into("FAQ_Category");
    });

  }

  async deleteById(id_faq: number): Promise<boolean> {
    await governmentDb.transaction(async (trx) => {
      // await trx("FAQ_Category").where("Fk_FAQ", id_faq).del();
      await trx("FAQ").where("Id", id_faq).del();
    });
    return true;
  }
  async deleteCategoryById(id_category: number): Promise<boolean> {
    await governmentDb.transaction(async (trx) => {
      // await trx("FAQ_Category").where("Fk_Category", id_category).del();
      await trx("Category").where("Id", id_category).del();
    });
    return true;
  }

  async loadById(
    id_faq: number
  ): Promise<FaqRepository.FaqWithCategoriesModel | null> {
    const faqDbResult = await governmentDb
      .select("*")
      .where({ Id: id_faq })
      .from("FAQ")
      .first();

    if (!faqDbResult) {
      return null;
    }

    const categoriesDbResult = await governmentDb
      .select("*")
      .from("FAQ_Category")
      .innerJoin("Category", "Category.Id", "FAQ_Category.Fk_Category")
      .where({ Fk_FAQ: faqDbResult.Id });

    const categoriesToDomain = categoriesDbResult.map((category) => {
      return {
        id: category.Id,
        title: category.Title,
        description: category.Description,
        created_at: category.CreatedAt,
        updated_at: category.UpdatedAt,
      };
    });

    return {
      id: faqDbResult.Id,
      question: faqDbResult.Question,
      answer: faqDbResult.Answer,
      order: faqDbResult.Order,
      created_at: faqDbResult.CreatedAt,
      updated_at: faqDbResult.UpdatedAt,
      categories: categoriesToDomain,
    };
  }

  async checkIfQuestionAlreadyExists(question: string): Promise<boolean> {
    const exists = await governmentDb
      .select("*")
      .from("FAQ")
      .where({ Question: question })
      .first();

    return exists ? true : false;
  }
  async checkIfFaqAlreadyExists(id: number): Promise<boolean> {
    const exists = await governmentDb
      .select("*")
      .from("FAQ")
      .where({ Id: id })
      .first();

    return exists ? true : false;
  }

  async loadByCategory(
    params: {
      id_category?: number;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<FaqRepository.FaqWithCategoriesModel>> {
    const { pageNumber, limit, offset, id_category } = params;

    const faqQuery = governmentDb
      .select("*")
      .from("FAQ")
      .whereIn(
        "Id",
        governmentDb("FAQ_Category")
          .select("Fk_FAQ")
          .where({ Fk_Category: id_category })
      )

    const totalCountReponse = await governmentDb("FAQ")
      .whereIn(
        "Id",
        governmentDb("FAQ_Category")
          .select("Fk_FAQ")
          .where({ Fk_Category: id_category })
      ).count()

    const totalCount = Number(totalCountReponse[0]['count(*)'])

    const faqsRows = await faqQuery.limit(limit).offset(offset)


    const faqsToDomain: Array<FaqRepository.FaqWithCategoriesModel> =
      faqsRows.map((faqDbResult) => ({
        id: faqDbResult.Id,
        question: faqDbResult.Question,
        answer: faqDbResult.Answer,
        order: faqDbResult.Order,
        created_at: faqDbResult.CreatedAt,
        updated_at: faqDbResult.UpdatedAt,
        categories: [],
      }));

    // TO-DO: remove N+1 query
    await Promise.allSettled(
      faqsToDomain.map(async (faq) => {
        const categories = await this.loadCategoriesByFaqId(faq.id);
        faq.categories = categories || [];
        return faq;
      })
    );
    return toPaginatedOutput({
      data: faqsToDomain,
      page: pageNumber,
      count: totalCount,
      limit,
    });
  }


  async loadCategories(): Promise<Array<CategoryRepository.FaqCategoriesData> | null> {
    const categories = await governmentDb.select("*").from("Category");

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
  async loadCategoriesByIds(
    ids: Array<number>
  ): Promise<Array<CategoryRepository.FaqCategoriesData> | null> {
    const categories = await governmentDb
      .select("*")
      .from("Category")
      .whereIn("Id", ids);

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

  async loadCategoryById(
    id_category: number
  ): Promise<CategoryRepository.FaqCategoriesData | null> {
    const category = await governmentDb
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
  async loadCategoryByTitle(
    title: string
  ): Promise<CategoryRepository.FaqCategoriesData | null> {
    const category = await governmentDb
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

import {
  CategoryRepository,
  FaqRepository,
  FaqRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/faq-repository";
import { governmentDb } from "../connection/knexfile";

export class KnexFaqRepository implements FaqRepositoryProtocol {
  async add(data: {
    question: string;
    answer: string;
    order: number;
    categories: Array<number>;
  }): Promise<boolean> {
    const { question, answer, order, categories } = data;

    await governmentDb.transaction(async function (trx) {
      const faq = await trx
        .insert({
          Question: question,
          Answer: answer,
          Order: order,
          CreatedAt: governmentDb.fn.now(),
        })
        .returning("Id")
        .into("FAQ");

      const faq_id = faq[0].Id;

      for (const category_id of categories) {
        await trx
          .insert(
            {
              Fk_FAQ: faq_id,
              Fk_Category: category_id,
            },
            ["Fk_FAQ"]
          )
          .into("FAQ_Category");
      }
    });

    return true;
  }

  async updateCategory(
    id_category: number,
    title: string,
    description: string
  ): Promise<boolean> {
    await governmentDb("Category")
      .update({
        Title: title,
        Description: description,
        UpdatedAt: governmentDb.fn.now(),
      })
      .returning("Id")
      .where("Id", id_category);

    return true;
  }

  async addCategory(title: string, description: string): Promise<void> {
    await governmentDb
      .insert({
        Title: title,
        Description: description,
        CreatedAt: governmentDb.fn.now(),
      })
      .returning("Id")
      .into("Category");
  }

  async loadAll(): Promise<Array<FaqRepository.FaqWithCategoriesData> | null> {
    const faqsDbResult = await governmentDb.select("*").from("FAQ");

    if (!faqsDbResult) {
      return null;
    }

    const faqsToDomain: Array<FaqRepository.FaqWithCategoriesData> =
      faqsDbResult.map((faqDbResult) => ({
        id: faqDbResult.Id,
        question: faqDbResult.Question,
        answer: faqDbResult.Answer,
        order: faqDbResult.Order,
        created_at: faqDbResult.CreatedAt,
        updated_at: faqDbResult.UpdatedAt,
        categories: [],
      }));

    await Promise.allSettled(
      faqsToDomain.map(async (faq) => {
        const categories = await this.loadCategoriesByFaqId(faq.id);
        faq.categories = categories || [];
        return faq;
      })
    );

    return faqsToDomain;
  }

  async update(data: {
    id: number;
    question: string;
    answer: string;
    order: number;
    categories: Array<number>;
  }): Promise<boolean> {
    const { id, question, answer, order, categories } = data;

    await governmentDb.transaction(async function (trx) {
      await trx("FAQ")
        .update(
          {
            Question: question,
            Answer: answer,
            Order: order,
            UpdatedAt: governmentDb.fn.now(),
          },
          ["Id"]
        )
        .where({ Id: id });

      await trx("FAQ_Category").where("Fk_FAQ", id).del();

      for (const category_id of categories) {
        await trx
          .insert({
            Fk_FAQ: id,
            Fk_Category: category_id,
          })
          .into("FAQ_Category");
      }
    });
    return true;
  }

  async deleteById(id_faq: number): Promise<boolean> {
    await governmentDb.transaction(async (trx) => {
      await trx("FAQ_Category").where("Fk_FAQ", id_faq).del();
      await trx("FAQ").where("Id", id_faq).del();
    });
    return true;
  }
  async deleteCategoryById(id_category: number): Promise<boolean> {
    await governmentDb.transaction(async (trx) => {
      await trx("FAQ_Category").where("Fk_Category", id_category).del();
      await trx("Category").where("Id", id_category).del();
    });
    return true;
  }

  async loadById(
    id_faq: number
  ): Promise<FaqRepository.FaqWithCategoriesData | null> {
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
    id_category: number
  ): Promise<Array<FaqRepository.FaqWithCategoriesData> | null> {
    const filteredFAQsByCategoryDbResult = await governmentDb
      .select("*")
      .from("FAQ")
      .whereIn(
        "Id",
        governmentDb("FAQ_Category")
          .select("Fk_FAQ")
          .where({ Fk_Category: id_category })
      );

    const faqsToDomain: Array<FaqRepository.FaqWithCategoriesData> =
      filteredFAQsByCategoryDbResult.map((faqDbResult) => ({
        id: faqDbResult.Id,
        question: faqDbResult.Question,
        answer: faqDbResult.Answer,
        order: faqDbResult.Order,
        created_at: faqDbResult.CreatedAt,
        updated_at: faqDbResult.UpdatedAt,
        categories: [],
      }));

    await Promise.allSettled(
      faqsToDomain.map(async (faq) => {
        const categories = await this.loadCategoriesByFaqId(faq.id);
        faq.categories = categories || [];
        return faq;
      })
    );
    return faqsToDomain;
  }

  async loadCategoriesByFaqId(
    id_faq: number
  ): Promise<Array<CategoryRepository.FaqCategoriesData> | null> {
    const categories = await governmentDb
      .select("*")
      .from("FAQ_Category")
      .innerJoin("Category", "Category.Id", "FAQ_Category.Fk_Category")
      .where({ Fk_FAQ: id_faq });

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

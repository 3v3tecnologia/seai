import {
  FaqCategoriesData,
  FaqWithCategoriesData,
  FaqRepository,
} from "../../../../domain/ports/db/faq/faq-repository";
import connection from "../connection/knexfile";

export class PostgreSQLFaqRepository implements FaqRepository {
  async add(data: {
    question: string;
    answer: string;
    order: string;
    categories: Array<number>;
  }): Promise<boolean> {
    const { question, answer, order, categories } = data;

    await connection.transaction(async function (trx) {
      const faq = await trx
        .insert({
          Question: question,
          Answer: answer,
          Order: order,
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
    const result = await connection("Category")
      .update({
        Title: title,
        Description: description,
      })
      .returning("Id")
      .where("Id", id_category);
    console.log(`Categoria com id ${result[0].Id} atualizada com sucesso`);
    return true;
  }

  async addCategory(title: string, description: string): Promise<void> {
    const faqId = await connection
      .insert({
        Title: title,
        Description: description,
      })
      .returning("Id")
      .into("Category");

    console.log(`Categoria com id ${faqId[0].Id} criado com sucesso`);
  }

  async loadAll(): Promise<Array<FaqWithCategoriesData> | null> {
    const faqsDbResult = await connection.select("*").from("FAQ");

    if (!faqsDbResult) {
      return null;
    }

    const faqsToDomain: Array<FaqWithCategoriesData> = faqsDbResult.map(
      (faqDbResult) => ({
        id: faqDbResult.Id,
        question: faqDbResult.Question,
        answer: faqDbResult.Answer,
        order: faqDbResult.Order,
        created_at: faqDbResult.CreatedAt,
        updated_at: faqDbResult.UpdatedAt,
        categories: [],
      })
    );

    await Promise.allSettled(
      faqsToDomain.map(async (faq) => {
        const categories = await this.loadCategoriesByFaqId(faq.id);
        faq.categories = categories || [];
        return faq;
      })
    );

    console.log("FAQS WITH CATEGORIES = ", faqsToDomain);
    return faqsToDomain;
  }

  async update(data: {
    id: number;
    question: string;
    answer: string;
    order: string;
    categories: Array<number>;
  }): Promise<boolean> {
    const { id, question, answer, order, categories } = data;

    await connection.transaction(async function (trx) {
      await trx("FAQ")
        .update(
          {
            Question: question,
            Answer: answer,
            Order: order,
          },
          ["Id"]
        )
        .where({ Id: id });

      console.log(`FAQ com id ${id} atualizado com sucesso`);

      await trx("FAQ_Category").where("Fk_FAQ", id).del();

      for (const category_id of categories) {
        await trx
          .insert({
            Fk_FAQ: id,
            Fk_Category: category_id,
          })
          .into("FAQ_Category");

        console.log(`Categoria ${category_id} criado com sucesso`);
      }
    });
    return true;
  }

  async deleteById(id_faq: number): Promise<boolean> {
    await connection.transaction(async (trx) => {
      await trx("FAQ_Category").where("Fk_FAQ", id_faq).del();
      await trx("FAQ").where("Id", id_faq).del();
    });
    return true;
  }
  async deleteCategoryById(id_category: number): Promise<boolean> {
    await connection.transaction(async (trx) => {
      await trx("FAQ_Category").where("Fk_Category", id_category).del();
      await trx("Category").where("Id", id_category).del();
    });
    return true;
  }

  async loadById(id_faq: number): Promise<FaqWithCategoriesData | null> {
    const faqDbResult = await connection
      .select("*")
      .where({ Id: id_faq })
      .from("FAQ")
      .first();

    if (!faqDbResult) {
      return null;
    }

    const categoriesDbResult = await connection
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
    const exists = await connection
      .select("*")
      .from("FAQ")
      .where({ Question: question })
      .first();

    return exists ? true : false;
  }
  async checkIfFaqAlreadyExists(id: number): Promise<boolean> {
    const exists = await connection
      .select("*")
      .from("FAQ")
      .where({ Id: id })
      .first();

    return exists ? true : false;
  }

  async loadByCategory(
    id_category: number
  ): Promise<Array<FaqWithCategoriesData> | null> {
    const filteredFAQsByCategoryDbResult = await connection
      .select("*")
      .from("FAQ")
      .whereIn(
        "Id",
        connection("FAQ_Category")
          .select("Fk_FAQ")
          .where({ Fk_Category: id_category })
      );

    console.log("FAQ = ", filteredFAQsByCategoryDbResult);

    const faqsToDomain: Array<FaqWithCategoriesData> =
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
  ): Promise<Array<FaqCategoriesData> | null> {
    const categories = await connection
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
  async loadCategories(): Promise<Array<FaqCategoriesData> | null> {
    const categories = await connection.select("*").from("Category");

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
  ): Promise<FaqCategoriesData | null> {
    const category = await connection
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
  async loadCategoryByTitle(title: string): Promise<FaqCategoriesData | null> {
    const category = await connection
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

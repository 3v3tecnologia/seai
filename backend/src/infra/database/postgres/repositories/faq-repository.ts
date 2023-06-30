import {
  FaqCategoriesData,
  FaqWithCategoriesData,
} from "../../../../domain/ports/db/faq/faq-repository";
import connection from "../connection/knexfile";

export namespace FaqRepository {}

export class FaqRepository implements FaqRepository {
  async add(data: {
    question: string;
    answer: string;
    order: string;
    categories: Array<number>;
  }): Promise<boolean> {
    return true;
  }

  async updateCategory(
    id_categoy: number,
    title: string,
    description: string
  ): Promise<boolean> {
    return true;
  }

  async addCategory(title: string, description: string): Promise<boolean> {
    return true;
  }
  async loadAll(): Promise<Array<FaqWithCategoriesData> | null> {
    return null;
  }

  async update(data: {
    id: number;
    question: string;
    answer: string;
    order: string;
    categories: Array<number>;
  }): Promise<boolean> {
    return true;
  }

  async deleteById(id: number): Promise<boolean> {
    return true;
  }
  async deleteCategoryById(id_category: number): Promise<boolean> {
    return true;
  }

  async loadById(id: number): Promise<Array<FaqWithCategoriesData> | null> {
    return null;
  }

  async loadByCategory(
    id_category: number
  ): Promise<Array<FaqWithCategoriesData> | null> {
    return null;
  }

  async loadCategories(): Promise<Array<FaqCategoriesData> | null> {
    return [
      {
        id: 1,
        title: "test",
        description: "test",
        created_at: "sads",
        updated_at: "asdasd",
      },
    ];
  }
}

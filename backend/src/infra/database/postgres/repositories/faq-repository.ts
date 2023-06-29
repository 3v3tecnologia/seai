import { FaqCategoriesData } from "../../../../domain/use-cases/faq/ports/faq-repository";
import connection from "../connection/knexfile";

export namespace FaqRepository {}

export class FaqRepository implements FaqRepository {
  async add(data: any): Promise<boolean> {
    return true;
  }

  async loadAll(): Promise<Array<any> | null> {
    return null;
  }

  async update(data: any): Promise<boolean> {
    return true;
  }

  async deleteById(id: number): Promise<boolean> {
    return true;
  }

  async loadById(id: number): Promise<any | null> {
    return null;
  }

  async loadByCategory(id_category: number): Promise<any | null> {
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

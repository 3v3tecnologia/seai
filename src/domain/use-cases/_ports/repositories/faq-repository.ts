export namespace FaqRepository {
  export type FaqWithCategoriesData = {
    id: number;
    question: string;
    answer: string;
    order: number;
    created_at?: string;
    updated_at?: string;
    categories: Array<CategoryRepository.FaqCategoriesData> | Array<void>;
  };

  export interface Add {
    add(data: {
      question: string;
      answer: string;
      order: number;
      categories: Array<number>;
    }): Promise<boolean>;
  }

  export interface DeleteById {
    deleteById(id: number): Promise<boolean>;
  }

  export interface Update {
    update(data: {
      id: number;
      question: string;
      answer: string;
      order: number;
      categories: Array<number>;
    }): Promise<boolean>;
  }

  export interface FetchWithCategories {
    loadAll(): Promise<Array<FaqWithCategoriesData> | null>;
  }

  export interface FetchByCategory {
    loadByCategory(
      id_category: number
    ): Promise<Array<FaqWithCategoriesData> | null>;
  }

  export interface FetchById {
    loadById(id: number): Promise<FaqWithCategoriesData | null>;
  }

  export interface CheckIfAlreadyExists {
    checkIfFaqAlreadyExists(id: number): Promise<boolean>;
  }

  export interface CheckIfQuestionExists {
    checkIfQuestionAlreadyExists(question: string): Promise<boolean>;
  }
}

export namespace CategoryRepository {
  export type FaqCategoriesData = {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  };

  export interface Add {
    addCategory(title: string, description: string): Promise<void>;
  }

  export interface Update {
    updateCategory(
      id_category: number,
      title: string,
      description: string
    ): Promise<boolean>;
  }

  export interface DeleteById {
    deleteCategoryById(id_category: number): Promise<boolean>;
  }

  export interface Fetch {
    loadCategories(): Promise<Array<FaqCategoriesData> | null>;
  }

  export interface FetchAllByIds {
    loadCategoriesByIds(
      ids: Array<number>
    ): Promise<Array<CategoryRepository.FaqCategoriesData> | null>;
  }

  export interface FetchById {
    loadCategoryById(id_category: number): Promise<FaqCategoriesData | null>;
  }

  export interface FetchByTitle {
    loadCategoryByTitle(title: string): Promise<FaqCategoriesData | null>;
  }
}

export interface FaqRepositoryProtocol
  extends FaqRepository.Add,
    FaqRepository.FetchWithCategories,
    FaqRepository.FetchByCategory,
    FaqRepository.FetchById,
    FaqRepository.Update,
    FaqRepository.CheckIfAlreadyExists,
    FaqRepository.CheckIfQuestionExists,
    FaqRepository.DeleteById,
    CategoryRepository.Add,
    CategoryRepository.Update,
    CategoryRepository.DeleteById,
    CategoryRepository.Fetch,
    CategoryRepository.FetchById,
    CategoryRepository.FetchAllByIds,
    CategoryRepository.FetchByTitle {}

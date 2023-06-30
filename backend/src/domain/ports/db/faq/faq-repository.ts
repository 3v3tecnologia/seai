export interface FaqCategoriesData {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}
export interface FaqWithCategoriesData {
  id: number;
  question: string;
  answer: string;
  order: number;
  created_at?: string;
  updated_at?: string;
  categories: Array<FaqCategoriesData>;
}

export interface FaqRepository {
  add(data: {
    question: string;
    answer: string;
    order: string;
    categories: Array<number>;
  }): Promise<boolean>;
  addCategory(title: string, description: string): Promise<boolean>;
  loadAll(): Promise<Array<FaqWithCategoriesData> | null>;
  loadByCategory(
    id_category: number
  ): Promise<Array<FaqWithCategoriesData> | null>;
  loadById(id: number): Promise<Array<FaqWithCategoriesData> | null>;
  update(data: {
    id: number;
    question: string;
    answer: string;
    order: string;
    categories: Array<number>;
  }): Promise<boolean>;
  updateCategory(
    id_categoy: number,
    title: string,
    description: string
  ): Promise<boolean>;
  deleteById(id: number): Promise<boolean>;
  deleteCategoryById(id_category: number): Promise<boolean>;
  loadCategories(): Promise<Array<FaqCategoriesData> | null>;
}

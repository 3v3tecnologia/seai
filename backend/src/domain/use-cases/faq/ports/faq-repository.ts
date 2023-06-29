export interface FaqCategoriesData {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface FaqRepository {
  add(data: any): Promise<boolean>;
  loadAll(): Promise<Array<any> | null>;
  update(data: any): Promise<boolean>;
  deleteById(id: number): Promise<boolean>;
  loadById(id: number): Promise<any | null>;
  loadByCategory(id_category: number): Promise<any | null>;
  loadCategories(): Promise<Array<FaqCategoriesData> | null>;
}

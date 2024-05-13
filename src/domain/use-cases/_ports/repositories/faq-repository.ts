import { IOutputWithPagination, IPaginationInput } from "../../helpers/pagination";
import { FaqCategoriesData, FaqWithCategoriesData } from "./models/faqData";


export interface FaqRepositoryProtocol {
  addFaq(data: {
    question: string;
    answer: string;
    order: number;
    category_id: number;
  }): Promise<number | null>;

  deleteFaqById(id_faq: number): Promise<number | null>;

  updateFaq(data: {
    id: number;
    question: string;
    answer: string;
    order: number;
    category_id: number;
  }): Promise<void>;
  getFaqs(params: {
    question?: string
  } & IPaginationInput): Promise<IOutputWithPagination<FaqWithCategoriesData>>;

  getFagsByCategory(
    params: {
      id_category: number;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<FaqWithCategoriesData>>;


  getFaqById(
    id_faq: number
  ): Promise<FaqWithCategoriesData | null>;

  checkIfFaqAlreadyExists(id: number): Promise<boolean>;

  checkIfQuestionAlreadyExists(question: string): Promise<boolean>;

  addCategory(title: string, description: string): Promise<number>
  updateCategory(
    id_category: number,
    title: string,
    description: string
  ): Promise<void>
  deleteCategoryById(id_category: number): Promise<number | null>
  getCategories(): Promise<Array<FaqCategoriesData> | null>;
  getCategoryById(id_category: number): Promise<FaqCategoriesData | null>;
  getCategoryByTitle(title: string): Promise<FaqCategoriesData | null>;
}

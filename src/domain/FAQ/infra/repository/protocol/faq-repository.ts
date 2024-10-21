import { UserCommandOperationProps } from "../../../../Logs/core/protocols/logger";
import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../../shared/utils/pagination";
import { FaqCategoriesData, FaqWithCategoriesData } from "./faqData";

export interface FaqRepositoryProtocol {
  addFaq(
    data: {
      question: string;
      answer: string;
      category_id: number;
    },
    accountId: number
  ): Promise<number | null>;

  deleteFaqById(
    id_faq: number,
    operation: UserCommandOperationProps
  ): Promise<number | null>;

  updateFaq(
    data: {
      id: number;
      question: string;
      answer: string;
      category_id: number;
    },
    operation: UserCommandOperationProps
  ): Promise<void>;
  getFaqs(
    params: {
      question?: string;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<FaqWithCategoriesData>>;

  getFagsByCategory(
    params: {
      id_category: number;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<FaqWithCategoriesData>>;

  getFaqById(id_faq: number): Promise<FaqWithCategoriesData | null>;

  checkIfFaqAlreadyExists(id: number): Promise<boolean>;

  checkIfQuestionAlreadyExists(question: string): Promise<boolean>;
  checkIfCategoryIsAlreadyAssociated(category_id: number): Promise<boolean>;
  addCategory(
    title: string,
    description: string,
    accountId: number
  ): Promise<number>;
  updateCategory(
    category: {
      id_category: number;
      title: string;
      description: string;
    },
    operation: UserCommandOperationProps
  ): Promise<void>;
  deleteCategoryById(
    id_category: number,
    operation: UserCommandOperationProps
  ): Promise<number | null>;
  getCategories(): Promise<Array<FaqCategoriesData> | null>;
  getCategoryById(id_category: number): Promise<FaqCategoriesData | null>;
  getCategoryByTitle(title: string): Promise<FaqCategoriesData | null>;
}

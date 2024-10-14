import { Either } from "../../../../shared/Either";
import { IOutputWithPagination, IPaginationInput } from "../../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { FaqCategoriesData, FaqWithCategoriesData } from "../../infra/repository/protocol/faqData";

export interface IFaqService {
  createFaq(
    request: {
      question: string;
      answer: string;
      id_category: number;
      accountId: number;
    }
  ): Promise<Either<Error, number>>
  updateFaq(
    request: {
      id: number;
      question: string;
      answer: string;
      id_category: number;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>
  getFaqById(
    request: { id_faq: number }
  ): Promise<Either<Error, FaqWithCategoriesData | null>>
  deleteFaqById(
    id: number,
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>
  getFaqs(
    params: {
      id_category?: number;
      question?: string;
    } & IPaginationInput
  ): Promise<Either<Error, IOutputWithPagination<FaqWithCategoriesData>>>
  createCategory(
    request: {
      title: string;
      description: string;
    },
    accountId: number
  ): Promise<Either<Error, number>>
  deleteCategory(
    id_category: number,
    operation: UserCommandOperationProps
  ): Promise<Either<Error, any>>
  updateCategory(
    request: {
      id: number;
      title: string;
      description: string;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>
  getCategories(): Promise<Either<Error, Array<FaqCategoriesData> | null>>
}

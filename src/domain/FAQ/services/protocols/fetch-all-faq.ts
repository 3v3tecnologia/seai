import { Either } from "../../../../shared/Either";
import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../shared/utils/pagination";
import { FaqWithCategoriesData } from "../../infra/repository/protocol/faqData";

export namespace GetFaqsUseCaseProtocol {
  export type Input = {
    id_category?: number;
    question?: string;
  } & IPaginationInput;

  export type Output = IOutputWithPagination<FaqWithCategoriesData>;

  export interface UseCase {
    execute(params: Input): Promise<Either<Error, Output>>;
  }
}

import { Either } from "../../../../shared/Either";
import { FaqWithCategoriesData } from "../../core/models/faqData";
import { IOutputWithPagination, IPaginationInput } from "../../../../shared/core/pagination";


export namespace GetFaqsUseCaseProtocol {
  export type Input = { id_category?: number, question?: string } & IPaginationInput;

  export type Output = IOutputWithPagination<FaqWithCategoriesData>;

  export interface UseCase {
    execute(
      params: Input
    ): Promise<Either<Error, Output>>;
  }

}


import { Either } from "../../../../shared/Either";
import { IOutputWithPagination, IPaginationInput } from "../../helpers/pagination";


export namespace GetFaqsUseCaseProtocol {
  export type Input = { id_category?: number, question?: string } & IPaginationInput;

  type FaqList = {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  }

  export type Output = IOutputWithPagination<{
    id: number;
    question: string;
    answer: string;
    // order: number;
    created_at?: string;
    updated_at?: string;
    categories: Array<FaqList> | Array<void>;
  }>;

  export interface UseCase {
    execute(
      params: Input
    ): Promise<Either<Error, Output>>;
  }

}


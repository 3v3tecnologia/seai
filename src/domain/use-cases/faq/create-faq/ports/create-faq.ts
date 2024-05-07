import { Either } from "../../../../../shared/Either";

export namespace CreateFaqDTO {
  export type params = {
    question: string;
    answer: string;
    order: number;
    categories: Array<number>;
  };

  export type result = number;
}

export interface CreateFaqProtocol {
  create(
    request: CreateFaqDTO.params
  ): Promise<Either<Error, CreateFaqDTO.result>>;
}

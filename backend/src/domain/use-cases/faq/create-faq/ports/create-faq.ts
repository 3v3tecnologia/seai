import { Either } from "../../../../../shared/Either";

export namespace CreateFaqDTO {
  export type params = {
    question: string;
    answer: string;
    order: string;
    category_id: number;
  };

  export type result = string;
}

export interface CreateFaqProtocol {
  create(
    request: CreateFaqDTO.params
  ): Promise<Either<Error, CreateFaqDTO.result>>;
}

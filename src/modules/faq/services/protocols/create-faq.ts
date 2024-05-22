import { Either } from "../../../../shared/Either";

export namespace CreateFaqDTO {
  export type params = {
    question: string;
    answer: string;
    order: number;
    id_category: number;
  };

  export type result = number;
}

export interface CreateFaqProtocol {
  execute(
    request: CreateFaqDTO.params
  ): Promise<Either<Error, CreateFaqDTO.result>>;
}

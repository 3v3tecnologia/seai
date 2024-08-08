import { Either } from "../../../../shared/Either";

export namespace CreateFaqDTO {
  export type params = {
    question: string;
    answer: string;
    id_category: number;
    accountId: number;
  };

  export type result = number;
}

export interface CreateFaqProtocol {
  execute(
    request: CreateFaqDTO.params
  ): Promise<Either<Error, CreateFaqDTO.result>>;
}

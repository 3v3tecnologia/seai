import { Either } from "../../../../../shared/Either";

export namespace UpdateFaqDTO {
  export type params = {
    id: number;
    question: string;
    answer: string;
    order: string;
    categories: Array<number>;
  };

  export type result = string;
}

export interface UpdateFaqProtocol {
  update(
    request: UpdateFaqDTO.params
  ): Promise<Either<Error, UpdateFaqDTO.result>>;
}

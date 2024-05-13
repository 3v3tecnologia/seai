import { Either } from "../../../../shared/Either";

export namespace UpdateFaqDTO {
  export type params = {
    id: number;
    question: string;
    answer: string;
    order: number;
    id_category: number;
  };

  export type result = string;
}

export interface UpdateFaqProtocol {
  execute(
    request: UpdateFaqDTO.params
  ): Promise<Either<Error, UpdateFaqDTO.result>>;
}

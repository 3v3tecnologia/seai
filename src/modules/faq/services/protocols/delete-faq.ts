import { Either } from "../../../../shared/Either";

export namespace DeleteFaqDTO {
  export type params = { id: number };

  export type result = string;
}

export interface DeleteFaqProtocol {
  execute(
    request: DeleteFaqDTO.params
  ): Promise<Either<Error, DeleteFaqDTO.result>>;
}

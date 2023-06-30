import { Either } from "../../../../../shared/Either";

export namespace UpdateFaqDTO {
  export type params = any;

  export type result = any;
}

export interface UpdateFaqProtocol {
  update(
    request: UpdateFaqDTO.params
  ): Promise<Either<Error, UpdateFaqDTO.result>>;
}

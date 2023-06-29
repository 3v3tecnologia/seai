import { Either } from "../../../../../shared/Either";

export namespace FetchFaqByCategoryDTO {
  export type params = { id_category: number };

  export type result = any;
}

export interface FetchFaqByCategoryProtocol {
  fetch(
    request: FetchFaqByCategoryDTO.params
  ): Promise<Either<Error, FetchFaqByCategoryDTO.result>>;
}

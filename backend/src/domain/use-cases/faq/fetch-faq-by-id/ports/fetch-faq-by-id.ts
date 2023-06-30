import { Either } from "../../../../../shared/Either";

export namespace FetchFaqByIdDTO {
  export type params = { id_faq: number };

  export type result = any;
}

export interface FetchFaqByIdProtocol {
  fetch(
    request: FetchFaqByIdDTO.params
  ): Promise<Either<Error, FetchFaqByIdDTO.result>>;
}

import { Either } from "../../../../../shared/Either";

export namespace FetchFaqCategoriesDTO {
  export type params = { id_category: number };

  export type result = any;
}

export interface FetchFaqCategoriesProtocol {
  fetch(): Promise<Either<Error, FetchFaqCategoriesDTO.result>>;
}

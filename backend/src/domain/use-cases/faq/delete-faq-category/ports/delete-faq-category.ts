import { Either } from "../../../../../shared/Either";

export namespace DeleteFaqCategoryDTO {
  export type params = { id_category: number };

  export type result = any;
}

export interface DeleteFaqCategoryProtocol {
  delete(
    request: DeleteFaqCategoryDTO.params
  ): Promise<Either<Error, DeleteFaqCategoryDTO.result>>;
}

import { Either } from "../../../../../shared/Either";

export namespace CreateFaqCategoryDTO {
  export type params = {
    title: string;
    description: string;
  };

  export type result = string;
}

export interface CreateFaqCategoryProtocol {
  create(
    request: CreateFaqCategoryDTO.params
  ): Promise<Either<Error, CreateFaqCategoryDTO.result>>;
}

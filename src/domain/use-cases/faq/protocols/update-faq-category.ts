import { Either } from "../../../../shared/Either";

export namespace UpdateFaqCategoryDTO {
  export type params = {
    id: number;
    title: string;
    description: string;
  };

  export type result = string;
}

export interface UpdateFaqCategoryProtocol {
  execute(
    request: UpdateFaqCategoryDTO.params
  ): Promise<Either<Error, UpdateFaqCategoryDTO.result>>;
}

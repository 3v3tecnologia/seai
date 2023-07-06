import { Either } from "../../../../shared/Either";
import { CreateFaqCategoryDTO } from "./dto";

export interface CreateFaqCategoryProtocol {
  create(
    request: CreateFaqCategoryDTO.params
  ): Promise<Either<Error, CreateFaqCategoryDTO.result>>;
}

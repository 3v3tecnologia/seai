import { UserCommandOperationProps } from "../../../../modules/UserOperations/protocols/logger";
import { Either } from "../../../../shared/Either";

export interface DeleteFaqCategoryProtocol {
  execute(
    id_category: number,
    operation: UserCommandOperationProps
  ): Promise<Either<Error, any>>;
}

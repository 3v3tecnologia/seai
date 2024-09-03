import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { Either } from "../../../../shared/Either";

export interface DeleteFaqProtocol {
  execute(
    id: number,
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>;
}
import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { Either } from "../../../../shared/Either";

export interface UpdateFaqCategoryProtocol {
  execute(
    category: {
      id: number;
      title: string;
      description: string;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>;
}

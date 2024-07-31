import { UserCommandOperationProps } from "../../../../modules/UserOperations/protocols/logger";
import { Either } from "../../../../shared/Either";

export interface UpdateFaqProtocol {
  execute(
    request: {
      id: number;
      question: string;
      answer: string;
      order: number;
      id_category: number;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>;
}

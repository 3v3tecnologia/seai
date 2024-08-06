import { UserCommandOperationProps } from "../../../../modules/Logs/protocols/logger";
import { Either } from "../../../../shared/Either";

export interface UpdateFaqProtocol {
  execute(
    request: {
      id: number;
      question: string;
      answer: string;
      id_category: number;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>;
}

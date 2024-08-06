import { Either } from "../../../../shared/Either";

export interface CreateFaqCategoryProtocol {
  create(
    request: {
      title: string;
      description: string;
    },
    accountId: number
  ): Promise<Either<Error, number>>;
}

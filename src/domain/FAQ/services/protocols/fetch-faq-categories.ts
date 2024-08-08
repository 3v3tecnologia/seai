import { Either } from "../../../../shared/Either";
import { FaqCategoriesData } from "../../infra/repository/protocol/faqData";

export namespace FetchFaqCategoriesDTO {
  export type params = { id_category: number };

  export type result = Array<FaqCategoriesData> | null;
}

export interface FetchFaqCategoriesProtocol {
  execute(): Promise<Either<Error, FetchFaqCategoriesDTO.result>>;
}

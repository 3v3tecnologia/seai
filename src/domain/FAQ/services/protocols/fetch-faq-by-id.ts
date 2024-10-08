import { Either } from "../../../../shared/Either";
import { FaqWithCategoriesData } from "../../infra/repository/protocol/faqData";

export namespace FetchFaqByIdDTO {
  export type params = { id_faq: number };

  export type result = FaqWithCategoriesData | null;
}

export interface FetchFaqByIdProtocol {
  execute(
    request: FetchFaqByIdDTO.params
  ): Promise<Either<Error, FetchFaqByIdDTO.result>>;
}

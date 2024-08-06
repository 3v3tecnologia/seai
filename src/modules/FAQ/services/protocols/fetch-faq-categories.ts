import { Either } from "../../../../shared/Either";
import { FaqCategoriesData } from "../../_ports/repositories/models/faqData";

export namespace FetchFaqCategoriesDTO {
  export type params = { id_category: number };


  export type result = Array<FaqCategoriesData> | null;
}

export interface FetchFaqCategoriesProtocol {
  execute(): Promise<Either<Error, FetchFaqCategoriesDTO.result>>;
}

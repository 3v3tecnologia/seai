import { Either } from "../../../../../shared/Either";

export namespace FetchFaqCategoriesDTO {
  export type params = { id_category: number };

  interface FaqCategoriesData {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  }

  export type result = Array<FaqCategoriesData> | null;
}

export interface FetchFaqCategoriesProtocol {
  execute(): Promise<Either<Error, FetchFaqCategoriesDTO.result>>;
}

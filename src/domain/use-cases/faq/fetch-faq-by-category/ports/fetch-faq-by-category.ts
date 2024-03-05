import { Either } from "../../../../../shared/Either";

export namespace FetchFaqByCategoryDTO {
  export type params = { id_category: number };

  interface FaqCategoriesData {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  }

  export type result = Array<{
    id: number;
    question: string;
    answer: string;
    order: number;
    created_at?: string;
    updated_at?: string;
    categories: Array<FaqCategoriesData> | Array<void>;
  }> | null;
}

export interface FetchFaqByCategoryProtocol {
  fetch(
    request: FetchFaqByCategoryDTO.params
  ): Promise<Either<Error, FetchFaqByCategoryDTO.result>>;
}

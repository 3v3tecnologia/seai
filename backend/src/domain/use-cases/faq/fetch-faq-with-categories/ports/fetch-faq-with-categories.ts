import { Either } from "../../../../../shared/Either";

export namespace FetchFaqWithCategoriesDTO {
  export type params = {};

  interface FaqCategoriesData {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  }

  export type result = {
    id: number;
    question: string;
    answer: string;
    order: number;
    created_at?: string;
    updated_at?: string;
    categories: Array<FaqCategoriesData> | Array<void>;
  } | null;
}

export interface FetchFaqWithCategoriesProtocol {
  fetch(): Promise<
    Either<Error, Array<FetchFaqWithCategoriesDTO.result> | null>
  >;
}

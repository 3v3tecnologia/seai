import { Either } from "../../../../../shared/Either";

export namespace FetchFaqByIdDTO {
  export type params = { id_faq: number };

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

export interface FetchFaqByIdProtocol {
  fetch(
    request: FetchFaqByIdDTO.params
  ): Promise<Either<Error, FetchFaqByIdDTO.result>>;
}

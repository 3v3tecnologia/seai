import { parsePaginationInput } from "./pagination";


export type AuditableInput<T> = {
  data: T;
  audit: {
    author: number;
    operation: string;
  }
}


export type PaginatedInput<T> = {
  data: T
  paginate: {
    pageNumber: number;
    limit: number;
    offset: number;
  }
}

export function mapToPaginatedInput<T>(data: T, paginate: {
  pageNumber: number;
  limit: number;
  offset: number;
}) {
  return {
    data,
    paginate: parsePaginationInput({
      page: paginate.pageNumber,
      limit: paginate.limit,
    })
  }
}

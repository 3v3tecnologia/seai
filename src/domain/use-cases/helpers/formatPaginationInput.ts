import { InputWithPagination } from "./dto";

export function formatPaginationInput(
  page?: number,
  limit?: number,
  options: {
    defaultLimit: number;
    defaultPageNumber: number;
  } = {
    defaultLimit: 40,
    defaultPageNumber: 1,
  }
): InputWithPagination {
  return {
    limit: limit ? Number(limit) : options.defaultLimit,
    pageNumber: page
      ? (limit as number) * (page - 1)
      : options.defaultPageNumber,
  };
}

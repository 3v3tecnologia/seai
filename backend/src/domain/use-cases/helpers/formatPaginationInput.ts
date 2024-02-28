import { InputWithPagination } from "./dto";

export function formatPaginationInput(
  pageNumber?: number,
  limit?: number,
  options: {
    defaultLimit: number;
    defaultPageNumber: number;
  } = {
    defaultLimit: 40,
    defaultPageNumber: 1,
  }
): InputWithPagination {
  const pageLimit = limit ? Number(limit) : options.defaultLimit;

  const page = pageNumber
    ? pageLimit * (pageNumber - 1)
    : options.defaultPageNumber;

  return {
    limit: pageLimit,
    pageNumber: page,
  };
}

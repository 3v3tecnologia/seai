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
  const pageLimit = limit ? Number(limit) : options.defaultLimit;
  const pageNumber =
    page && Number(page) > 0 ? Number(page) : options.defaultPageNumber;
  return {
    limit: pageLimit,
    pageNumber,
    offset: pageLimit * (pageNumber - 1),
  };
}

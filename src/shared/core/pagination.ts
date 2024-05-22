export type IPaginationInput = {
  pageNumber: number;
  limit: number;
  offset: number;
}

export type IOutputWithPagination<T> = {
  Items: Array<T> | null;
  TotalItems: number;
  Page: number;
  PageSize: number;
  TotalPages: number;
} | null;

export type OldOutputWithPagination<T> = {
  Data: Array<T>;
  Pagination: {
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
    QtdPages?: number;
  };
};



export function calculateTotalPages(totalItems: number, itemsPerPage: number) {
  return totalItems === 0 ? 0 : Math.floor((totalItems - 1) / itemsPerPage) + 1;
}

export function toPaginatedOutput<T>({
  data,
  page,
  limit,
  count,
}: {
  data: Array<T>;
  page: number;
  limit: number;
  count: number;
}) {
  const total = Number(count);
  const totalPages = calculateTotalPages(total, limit);

  return {
    Items: data,
    TotalItems: Number(total),
    Page: page,
    PageSize: Number(limit),
    TotalPages: totalPages,
  };
}

export function parsePaginationInput<T>(
  { limit, page }: {
    page?: number,
    limit?: number
  }
): IPaginationInput {
  const pageLimit = limit ? Number(limit) : 10;

  const pageNumber =
    page && Number(page) > 0 ? Number(page) : 1;

  return {
    limit: pageLimit,
    pageNumber,
    offset: pageLimit * (pageNumber - 1)
  };
}
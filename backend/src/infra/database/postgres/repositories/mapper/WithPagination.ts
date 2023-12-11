export function withPagination(
  data: any,
  pagination: { limit: number; offset: number; count: number; page?: number }
) {
  return {
    Data: data,
    Pagination: {
      PageLimitRows: pagination.limit,
      PageNumber: pagination.offset,
      QtdRows: pagination.count || 0,
      //   QtdPages: pagination?.count
      //     ? Math.ceil(pagination.count / pagination.limit)
      //     : 0,
    },
  };
}

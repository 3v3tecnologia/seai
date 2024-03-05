export function withPagination(
  data: any,
  pagination: { limit: number; offset: number; count: number; page?: number }
) {
  return {
    Data: data,
    Pagination: {
      PageLimitRows: pagination.limit,
      PageNumber: pagination.page || 1,
      QtdRows: pagination.count || 0,
      //   QtdPages: pagination?.count
      //     ? Math.ceil(pagination.count / pagination.limit)
      //     : 0,
    },
  };
}

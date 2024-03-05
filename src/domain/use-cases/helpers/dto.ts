export type InputWithPagination = {
  pageNumber: number;
  limit: number;
};

export type OutputWithPagination<T> = {
  Data: Array<T>;
  Pagination: {
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
    QtdPages?: number;
  };
};

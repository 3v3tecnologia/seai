import { Knex } from "knex";

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
    PageSize: limit,
    TotalPages: totalPages,
  };
}

export function countTotalRows(connection: Knex<any, unknown[]>) {
  return async function (query: string, binding?: Array<any>) {
    const countResponse = binding
      ? await connection.raw(query, binding)
      : await connection.raw(query);

    const [countRows] = countResponse.rows;

    return countRows ? Number(countRows.count) : 0;
  };
}

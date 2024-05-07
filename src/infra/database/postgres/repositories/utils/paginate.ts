import { Knex } from "knex";


export function countTotalRows(connection: Knex<any, unknown[]>) {
  return async function (query: string, binding?: Array<any>) {
    const countResponse = binding
      ? await connection.raw(query, binding)
      : await connection.raw(query);

    const [countRows] = countResponse.rows;

    return countRows ? Number(countRows.count) : 0;
  };
}

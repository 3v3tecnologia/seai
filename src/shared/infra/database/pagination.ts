import { Knex } from "knex";

export async function getPaginatedResult(
    query: Knex.QueryBuilder,
    limit: number,
    offset: number
) {
    const count = query.clone().count().clearSelect();
    const [rows, countResponse] = await Promise.all([
        query.limit(limit).offset(offset),
        count,
    ]);

    return {
        rows,
        count: countResponse.length,
    };
}
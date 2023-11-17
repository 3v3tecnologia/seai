import {
  Actions,
  LogRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/log-repository";
import { logsDb } from "../connection/knexfile";

export class KnexLogOperationsRepository implements LogRepositoryProtocol {
  async logError(message: string): Promise<void> {
    // insert log in database
  }
  async saveUserActions(
    user_id: number,
    actions: Array<Actions>
  ): Promise<void> {
    const toPersistence = actions.map((action) => ({
      User: user_id,
      Action: action.action,
      Table: action.table,
      Description: action.description,
    }));
    console.log("[LOG OPERATION] ::: ", toPersistence);

    // insert log in database
    await logsDb.insert(toPersistence).into("User");
  }

  async fetchMeasuresByIdEquipment(request: {
    id: number;
    time?: {
      start: string;
      end?: string | null;
    } | null;
    limit: number;
    pageNumber: number;
  }): Promise<{
    data: Array<{
      Time: string;
      Status: string;
      Operation: string;
      Message: string;
    }> | null;
    count: number;
  } | null> {
    const { id, limit, pageNumber, time } = request;

    const binding = [];
    const queries: Array<any> = [];

    queries.push(`WHERE e."FK_Equipment" = ?`);
    binding.push(id);

    if (time) {
      queries.push(`AND e."Time"::DATE >= ?`);
      binding.push(time.start);

      if (time.end !== null) {
        queries.push(`AND e."Time"::DATE <= ?`);
        binding.push(time.end);
      }
    }

    queries.push('ORDER BY e."Time" ASC');

    queries.push(`LIMIT ? OFFSET ?`);
    binding.push(limit || 50);
    binding.push(pageNumber ? limit * (pageNumber - 1) : 0);

    const sqlQuery = `
      SELECT e."Time" ,e."Status" ,e."Operation" ,e."Message"  FROM "ETL" e
      ${queries.join(" ")};`;

    const raw = await logsDb.raw(sqlQuery, binding);

    const rows = raw.rows.length ? raw.rows : null;

    if (rows === null) {
      return null;
    }

    const toDomain = rows.map((row: any) => ({
      Time: row.Time,
      Status: row.Status,
      Operation: row.Operation,
      Message: row.Message,
    }));

    return {
      data: toDomain,
      count: 10,
    };
  }
}

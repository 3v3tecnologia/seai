import {
  Actions,
  LogRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/log-repository";
import { logsDb } from "../connection/knexfile";

export class LogOperationsRepository implements LogRepositoryProtocol {
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
}

import {
  Actions,
  LogRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/log-repository";

export class LogOperationsRepository implements LogRepositoryProtocol {
  async logError(message: string): Promise<void> {
    // insert log in database
  }
  async saveUserActions(
    user_id: number,
    actions: Array<Actions>
  ): Promise<void> {
    console.log("[LOG OPERATION] ::: ", user_id, " ", actions);
    // insert log in database
  }
}

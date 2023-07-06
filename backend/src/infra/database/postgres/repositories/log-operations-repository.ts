export interface LogRepository {
  logError: (stack: string) => Promise<void>;
  logInfo(user_id: number, actions: Array<Actions>): Promise<void>;
  logWarning(message: string): Promise<void>;
}

type Actions = {
  action: string;
  table: string;
  description?: string;
};

export class LogOperationsRepository implements LogRepository {
  async logError(message: string): Promise<void> {
    // insert log in database
  }
  async logInfo(user_id: number, actions: Array<Actions>): Promise<void> {
    console.log("[LOG OPERATION] ::: ", user_id, " ", actions);
    // insert log in database
  }
  async logWarning(message: string): Promise<void> {
    // insert log in database
  }
}

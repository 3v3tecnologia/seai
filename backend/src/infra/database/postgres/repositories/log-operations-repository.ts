export interface LogErrorRepository {
  logError: (stack: string) => Promise<void>;
  logInfo(message: string): Promise<void>;
  logWarning(message: string): Promise<void>;
}

export class LogOperationsRepository implements LogErrorRepository {
  async logError(message: string): Promise<void> {
    // insert log in database
  }
  async logInfo(message: string): Promise<void> {
    // insert log in database
  }
  async logWarning(message: string): Promise<void> {
    // insert log in database
  }
}

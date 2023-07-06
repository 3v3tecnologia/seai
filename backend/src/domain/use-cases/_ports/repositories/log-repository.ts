export interface LogRepositoryProtocol {
  logError: (stack: string) => Promise<void>;
  logInfo(user_id: number, actions: Array<Actions>): Promise<void>;
  logWarning(message: string): Promise<void>;
}

export type Actions = {
  action: string;
  table: string;
  description?: string;
};

export interface UserOperationsLoggerProtocol {
  save(user_id: number, description: string): Promise<void>;
}

export type CommandProps = {
  accountId: number;
  description: string;
};

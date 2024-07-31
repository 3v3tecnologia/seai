export interface UserOperationsLoggerProtocol {
  save(user_id: number, description: string): Promise<void>;
}

export type UserCommandOperationProps = {
  author: number;
  operation: string;
};

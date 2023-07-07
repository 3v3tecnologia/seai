export interface LogRepositoryProtocol {
  saveUserActions(user_id: number, actions: Array<Actions>): Promise<void>;
}

export type Actions = {
  action: string;
  table: string;
  description?: string;
};

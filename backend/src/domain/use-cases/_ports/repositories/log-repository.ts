export interface LogRepositoryProtocol {
  saveUserActions(user_id: number, actions: Array<Actions>): Promise<void>;
  fetchMeasuresByIdEquipment(request: {
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
  } | null>;
}

export type Actions = {
  action: string;
  table: string;
  description?: string;
};

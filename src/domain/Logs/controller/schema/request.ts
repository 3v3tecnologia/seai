import { IPaginationInput } from "../../../../shared/utils/pagination";

export type GetAllInput = {
  user_id?: number;
  resource?: string;
  operation?: string;
  start_date?: string;
  end_date?: string;
} & Partial<IPaginationInput>;

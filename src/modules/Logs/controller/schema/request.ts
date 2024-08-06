import { IPaginationInput } from "../../../../domain/use-cases/helpers/pagination";

export type GetAllInput = {
  user_id?: number;
  resource?: string;
  operation?: string;
} & Partial<IPaginationInput>;

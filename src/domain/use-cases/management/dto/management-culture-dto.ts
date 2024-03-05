import { CultureCyclesDTO } from "./management-culture-cycles.dto";

export type ManagementCultureDTO = {
  id?: number;
  name: string;
  idBasin: number;
  locationName: string | null;
  cycles: Array<CultureCyclesDTO>;
  createdAt?: string;
  updatedAt?: string;
};

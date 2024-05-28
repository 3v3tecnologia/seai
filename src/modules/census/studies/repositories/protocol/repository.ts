import { CropStudies } from "../../core/model/crop-studies";

export interface ICensusStudiesRepository {
  create(
    params: {
      data: Array<CropStudies>,
      id: number
    }
  ): Promise<void>;
  delete(id: number): Promise<void>;
  getByBasin(
    id: number
  ): Promise<{
    [k: string]: Omit<CropStudies, "crop">;
  } | null>;
}

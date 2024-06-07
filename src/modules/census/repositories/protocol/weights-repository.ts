import { CensusCultureWeights } from "../../core/model/indicators-weights";

export interface IIndicatorsWeightsRepository {
  save(weights: Array<CensusCultureWeights>): Promise<void>;
  delete(
    mask: number
  ): Promise<void>;
  checkBasinsIds(ids: Array<number>): Promise<Array<number> | null>
  getByMask(mask: number, year: number): Promise<CensusCultureWeights[]>
  checkIfAlreadyExists(mask: number, year: number): Promise<boolean>
  calculate(
    params: {
      basin_ids: Array<number>;
      users_registered_count?: number;
      crops_names?: Array<string>
    }
  ): Promise<Array<CensusCultureWeights> | null>;
}
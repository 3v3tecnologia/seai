import { CensusCultureWeights } from "../../../core/model/indicators-weights";

export interface IIndicatorsWeightsRepository {
  save(weights: Array<CensusCultureWeights>, basin_mask: number): Promise<void>;
  delete(mask: number): Promise<void>;
  getAllBasin(): Promise<Array<{ id: number; name: string }>>;
  checkBasinsIds(ids: Array<number>): Promise<Array<number> | null>;
  getByMask(mask: number, year: number): Promise<CensusCultureWeights[]>;
  checkIfAlreadyExists(mask: number, year: number): Promise<boolean>;
  calculate(params: {
    basin_ids: Array<number>;
  }): Promise<Array<CensusCultureWeights> | null>;
  calculateByBasinMask(
    basin_mask: number
  ): Promise<Array<CensusCultureWeights> | null>;
  getWaterCutByBasin(mask: number, year?: number): Promise<Array<any>>;
}

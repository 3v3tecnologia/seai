import { CensusCultureWeights } from "../../core/model/indicators-weights";

export interface IIndicatorsWeightsRepository {
  create(params: { id: number; weights: Array<CensusCultureWeights> }): Promise<void>;
  delete(
    id_basin: number
  ): Promise<void>;
  checkIfBasinMaskExists(id: number): Promise<boolean>
  getByBasin(
    basin: Array<number>
  ): Promise<Array<CensusCultureWeights> | null>;
}

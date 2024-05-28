import { IPaginationInput } from "../../../../../domain/use-cases/helpers/pagination";
import { CensusCultureWeights } from "../../core/model/indicators-weights";

export interface IIndicatorsWeightsRepository {
  create(params: { id: number; weights: Array<CensusCultureWeights> }): Promise<void>;
  delete(
    id_basin: number
  ): Promise<void>;
  getByBasin(
    params: { id_basin: number } & Partial<IPaginationInput>
  ): Promise<Array<CensusCultureWeights> | null>;
}

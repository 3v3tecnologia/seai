import { Either } from "../../../../shared/Either";
import { CensusCultureWeights } from "../../core/model/indicators-weights";

export interface ICensusWeightsService {
    create(params: {
        basin_ids: Array<number>;
        year: number;
        weights: Array<CensusCultureWeights>;
    }): Promise<Either<Error, string>>
    getByBasinsIds(params: {
        basin_ids: Array<number>;
        year: number;
    }): Promise<Either<Error, any | null>>;
    calculate(params: {
        basin_ids: Array<number>;
    }): Promise<Either<Error, any | null>>;
    getWaterCut(basin_ids: Array<number>): Promise<Either<Error, any | null>>;
    getBasin(): Promise<Either<Error, Array<{ id: number; name: string }>>>;
}
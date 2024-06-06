import { makeIndicatorsWeightsRepository } from "../repository/indicators-weights.repository";
import { CalculateIndicatorsWeightsService, InsertIndicatorsWeightsService, GetIndicatorsWeightsByBasinService } from "../services/indicators-weights";
import { GetIndicatorWeightsByBasinsIdsController, CalculateIndicatorWeightsController, InsertIndicatorsWeightsController } from "./indicators-weights.controller";
import { createIndicatorsWeightsValidator, getIndicatorsWeightsValidator, calculateIndicatorsWeightsValidator } from "./schema/validators";

export class MakeIndicatorsWeightsControllers {
    static createIndicatorsWeights() {
        return new InsertIndicatorsWeightsController(new InsertIndicatorsWeightsService(makeIndicatorsWeightsRepository()), createIndicatorsWeightsValidator)
    }
    static getIndicatorWeightsByBasin() {
        return new GetIndicatorWeightsByBasinsIdsController(new GetIndicatorsWeightsByBasinService(makeIndicatorsWeightsRepository()), getIndicatorsWeightsValidator)
    }
    static calcIndicatorWeights() {
        return new CalculateIndicatorWeightsController(new CalculateIndicatorsWeightsService(makeIndicatorsWeightsRepository()), calculateIndicatorsWeightsValidator)
    }
}
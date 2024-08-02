import { makeIndicatorsWeightsRepository } from "../../repositories/indicators-weights.repository";
import { CalculateIndicatorsWeightsService, GetIndicatorsWeightsByBasinService, GetWaterCutService, InsertIndicatorsWeightsService } from "../../services/indicators-weights";
import { CalculateIndicatorWeightsController, CalculateWatercutController, GetIndicatorWeightsByBasinsIdsController, InsertIndicatorsWeightsController } from "../indicators-weights.controller";
import { calculateIndicatorsWeightsValidator, createIndicatorsWeightsValidator, getIndicatorsWeightsValidator } from "../schema/weights";

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
    static getWaterCut() {
        return new CalculateWatercutController(new GetWaterCutService(makeIndicatorsWeightsRepository()), calculateIndicatorsWeightsValidator)
    }
}
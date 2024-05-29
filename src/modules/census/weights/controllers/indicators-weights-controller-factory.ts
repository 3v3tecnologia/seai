import { makeIndicatorsWeightsRepository } from "../repository/indicators-weights.repository";
import { CreateIndicatorsWeightsService, GetIndicatorsWeightsByBasinService } from "../services/indicators-weights";
import { CreateIndicatorsWeightsController, GetIndicatorWeightsByBasinController } from "./indicators-weights.controller";

export class MakeIndicatorsWeightsControllers {
    static createIndicatorsWeights() {
        return new CreateIndicatorsWeightsController(new CreateIndicatorsWeightsService(makeIndicatorsWeightsRepository()))
    }
    static getIndicatorWeightsByBasin() {
        return new GetIndicatorWeightsByBasinController(new GetIndicatorsWeightsByBasinService(makeIndicatorsWeightsRepository()))
    }
}
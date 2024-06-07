import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { makeGetCropsIndicatorsFromBasin } from "../../services/factories/fetch-by-basin";
import { GetCulturesIndicatorsFromBasinController } from "../fetch-crop-indicators-from-basin.controller";

export const makeGetCulturesIndicatorsFromBasin = (): Controller => {
    return new GetCulturesIndicatorsFromBasinController(
        makeGetCropsIndicatorsFromBasin()
    );
}
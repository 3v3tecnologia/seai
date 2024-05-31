import { makeCensusStudiesRepository } from "../repositories/crop-studies.repository"
import { CreateCropStudiesService, GetCropStudiesByBasinService } from "../services/crop-studies"
import { CreateCropStudiesControllers, GetCropStudiesByBasinController } from "./crop-studies.controller"
import { createCropStudiesValidator, getCropStudiesValidator } from "./schema/validators"

export class MakeCropStudiesControllers {
    static createCropStudies() {
        return new CreateCropStudiesControllers(new CreateCropStudiesService(makeCensusStudiesRepository()), createCropStudiesValidator)
    }

    static getCropStudiesByBasin() {
        return new GetCropStudiesByBasinController(new GetCropStudiesByBasinService(makeCensusStudiesRepository()), getCropStudiesValidator)
    }
}
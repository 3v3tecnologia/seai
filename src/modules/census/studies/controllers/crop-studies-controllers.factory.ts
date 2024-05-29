import { makeCensusStudiesRepository } from "../repositories/crop-studies.repository"
import { CreateCropStudiesService, GetCropStudiesByBasinService } from "../services/crop-studies"
import { CreateCropStudiesControllers, GetCropStudiesByBasinController } from "./crop-studies.controller"

export class MakeCropStudiesControllers {
    static createCropStudies() {
        return new CreateCropStudiesControllers(new CreateCropStudiesService(makeCensusStudiesRepository()))
    }

    static getCropStudiesByBasin() {
        return new GetCropStudiesByBasinController(new GetCropStudiesByBasinService(makeCensusStudiesRepository()))
    }
}
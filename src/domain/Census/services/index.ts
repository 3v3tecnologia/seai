import { CensusStudiesRepository } from "../repositories/census-studies.repository";
import { IndicatorsWeightsRepository } from "../repositories/indicators-weights.repository";
import { CensusStudiesService } from "./census-studies.service";
import { CensusWeightsService } from "./census-weights.service";

export const censusStudiesService = new CensusStudiesService(new CensusStudiesRepository())

export const censusWeightsService = new CensusWeightsService(new IndicatorsWeightsRepository())
import { DbProfitabilitySecurityCensusRepository } from "../../../../../infra/database/postgres/repositories/profitability-security.repository";
import { DbWaterSecurityCensusRepository } from "../../../../../infra/database/postgres/repositories/water-security.repository";
import { DbWorkesrSecurityCensusRepository } from "../../../../../infra/database/postgres/repositories/workers-security.repository";
import { makeCensusStudiesRepository } from "../../../studies/repositories/crop-studies.repository";
import { GetCropsIndicatorsFromBasin, GetCropsIndicatorsFromBasinUseCaseProtocol } from "../fetch-crops-indicators-by-basin";

export const makeGetCropsIndicatorsFromBasin = (): GetCropsIndicatorsFromBasinUseCaseProtocol.UseCase => {
    return new GetCropsIndicatorsFromBasin(
        new DbProfitabilitySecurityCensusRepository(),
        new DbWorkesrSecurityCensusRepository(),
        new DbWaterSecurityCensusRepository(),
        makeCensusStudiesRepository()
    );
}
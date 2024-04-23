import { Either, right } from "../../../shared/Either";
import { CensusStudy } from "../entities/study";
import { DbCensusCropRepository } from "../infra/database/repositories/census-crop.repository";

import { DbManagementStudiesRepository } from "../infra/database/repositories/management-studies.repository";

export class ManagementStudiesUseCases {
  static async create(params: {
    id_basin: number;
    data: Array<Omit<CensusStudy, "Id_Basin">>;
  }): Promise<Either<Error, string>> {
    // TO-DO: check use of batch update
    // CHECK: is possible to create constraints in columns?
    const deleteLog = await DbManagementStudiesRepository.delete(
      params.id_basin
    );

    console.log(deleteLog.description);

    const createLog = await DbManagementStudiesRepository.create(
      params.data,
      params.id_basin
    );

    return right(createLog?.description);
  }

  static async getByBasin(
    id: number
  ): Promise<Either<Error, Array<CensusStudy> | null>> {
    // TO-DO : get crops from basin
    const censusCrops = await DbCensusCropRepository.getByBasin(id);

    if (censusCrops == null) {
      return right(null);
    }

    const studies = await DbManagementStudiesRepository.getByBasin(id);

    const result = censusCrops.map((censusCrop) => {
      const cropStudies: CensusStudy = {
        Crop: censusCrop,
        Consumption: null,
        CultivationPeriod: null,
        HarvestDuration: null,
        Productivity: null,
      };

      if (studies?.has(censusCrop)) {
        Object.assign(cropStudies, {
          ...studies.get(censusCrop),
        });
      }

      return cropStudies;
    });

    return right(result);
  }
}

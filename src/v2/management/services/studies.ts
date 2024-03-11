import { Either, right } from "../../../shared/Either";
import { CensusStudy } from "../entities/study";

import { DbManagementStudiesRepository } from "../infra/database/repositories/management-studies.repository";

export class ManagementStudiesUseCases {
  static async create(params: {
    id_basin: number;
    data: Array<CensusStudy>;
  }): Promise<Either<Error, string>> {
    // TO-DO: check use of batch update
    const deleteLog = await DbManagementStudiesRepository.delete(
      params.id_basin
    );

    const createLog = await DbManagementStudiesRepository.create(params.data);

    return right(createLog?.action);
    // return right(createLog.description);
  }

  static async getByBasin(
    id: number
  ): Promise<Either<Error, Array<CensusStudy> | null>> {
    // TO-DO : get crops from basin
    // const censusCrop = await DbCensusCropRepository.getAllCrops()

    const studies = await DbManagementStudiesRepository.getByBasin(id);

    if (studies) {
      return right(
        [...studies.entries()].map(([name, value]) => {
          return {
            Crop: name,
            ...value,
          };
        })
      );
    }

    return right(null);
  }
}

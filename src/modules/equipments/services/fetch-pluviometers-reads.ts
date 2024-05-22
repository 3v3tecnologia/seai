import { Either, right } from "../../../shared/Either";

import { PluviometerReadEntity } from "../core/models/PluviometerRead";

import { IEquipmentsMeasuresRepository } from "../infra/repositories/protocol/equipments-measurements.repository";
import { IPaginationInput, IOutputWithPagination } from "../../../shared/core/pagination";

export class FetchPluviometersReads {
  private readonly measuresRepository: IEquipmentsMeasuresRepository;

  constructor(measuresRepository: IEquipmentsMeasuresRepository) {
    this.measuresRepository = measuresRepository;
  }
  async execute(
    request: FetchPluviometersReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchPluviometersReadsUseCaseProtocol.Response>> {

    const result = await this.measuresRepository.getPluviometersReads(request);

    return right(result);
  }
}

export namespace FetchPluviometersReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    start?: string | null;
    end?: string | null;
  } & IPaginationInput;
  export type Response = IOutputWithPagination<PluviometerReadEntity> | null;
}

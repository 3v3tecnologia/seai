import { Either, right } from "../../../shared/Either";
import { StationReadEntity } from "../../entities/equipments/StationRead";

import { IEquipmentsMeasuresRepository } from "../_ports/repositories/equipments-measurements.repository";
import { IPaginationInput, IOutputWithPagination } from "../helpers/pagination";

export class FetchStationsReads {
  private readonly equipmentMeasuresRepository: IEquipmentsMeasuresRepository;

  constructor(equipmentMeasuresRepository: IEquipmentsMeasuresRepository) {
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
  }
  async execute(
    request: FetchStationsReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchStationsReadsUseCaseProtocol.Response>> {
    const result = await this.equipmentMeasuresRepository.getStationsReads(request);

    return right(result);
  }
}

export namespace FetchStationsReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    time?: {
      start: string;
      end: string | null;
    } | null;
  } & IPaginationInput;
  export type Response = IOutputWithPagination<StationReadEntity> | null;
}

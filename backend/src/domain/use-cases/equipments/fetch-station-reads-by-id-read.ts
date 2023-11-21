import { Either, right } from "../../../shared/Either";
import { StationReadEntity } from "../../entities/equipments/StationRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchStationReadsByIdRead {
  private readonly equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(
    equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol
  ) {
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
  }
  async execute(
    request: FetchStationReadsByIdReadProtocol.Request
  ): Promise<Either<Error, FetchStationReadsByIdReadProtocol.Response>> {
    const result =
      await this.equipmentMeasuresRepository.getStationReadsByIdRead({
        idRead: request.idRead,
      });

    return right(result || null);
  }
}

export namespace FetchStationReadsByIdReadProtocol {
  export type Request = {
    idRead: number;
  };
  export type Response = StationReadEntity | null;
}

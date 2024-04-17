import { Either, right } from "../../../shared/Either";
import { StationReadEntity } from "../../entities/equipments/StationRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchLatestStationMeasurements {
  private readonly equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(
    equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol
  ) {
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
  }
  async execute(
    request: FetchLatestStationMeasurementsProtocol.Request
  ): Promise<Either<Error, FetchLatestStationMeasurementsProtocol.Response>> {
    const result =
      await this.equipmentMeasuresRepository.getLatestStationMeasurements({
        id: request.id,
      });

    return right(result || null);
  }
}

export namespace FetchLatestStationMeasurementsProtocol {
  export type Request = {
    id: number;
  };
  export type Response = StationReadEntity | null;
}

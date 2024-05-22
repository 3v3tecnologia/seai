import { Either, right } from "../../../shared/Either";
import { PluviometerReadEntity } from "../core/models/PluviometerRead";
import { StationReadEntity } from "../core/models/StationRead";

import { IEquipmentsMeasuresRepository } from "../infra/repositories/protocol/equipments-measurements.repository";

export class FetchLatestEquipmentMeasurements {
  private readonly equipmentMeasuresRepository: IEquipmentsMeasuresRepository;

  constructor(equipmentMeasuresRepository: IEquipmentsMeasuresRepository) {
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
  }
  async execute(
    request: FetchLatestEquipmentMeasurementsProtocol.Request
  ): Promise<Either<Error, FetchLatestEquipmentMeasurementsProtocol.Response>> {
    switch (request.type) {
      case "station":
        return right(
          await this.equipmentMeasuresRepository.getLatestStationMeasurements({
            id: request.id,
          })
        );
      case "pluviometer":
        return right(
          await this.equipmentMeasuresRepository.getLatestPluviometerMeasurements(
            {
              id: request.id,
            }
          )
        );
      default:
        return right(null);
    }
  }
}

export namespace FetchLatestEquipmentMeasurementsProtocol {
  export type Request = {
    id: number;
    type: "station" | "pluviometer";
  };
  export type Response = StationReadEntity | PluviometerReadEntity | null;
  export interface UseCase {
    execute(
      request: FetchLatestEquipmentMeasurementsProtocol.Request
    ): Promise<
      Either<Error, FetchLatestEquipmentMeasurementsProtocol.Response>
    >;
  }
}

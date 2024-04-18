import { Either, right } from "../../../shared/Either";
import { PluviometerReadEntity } from "../../entities/equipments/PluviometerRead";
import { StationReadEntity } from "../../entities/equipments/StationRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchLatestEquipmentMeasurements {
  private readonly equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(
    equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol
  ) {
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

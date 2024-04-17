import { Either, right } from "../../../shared/Either";
import { PluviometerReadEntity } from "../../entities/equipments/PluviometerRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchLatestPluviometerMeasurements {
  private readonly equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(
    equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol
  ) {
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
  }
  async execute(
    request: FetchLatestPluviometerMeasurementsProtocol.Request
  ): Promise<
    Either<Error, FetchLatestPluviometerMeasurementsProtocol.Response>
  > {
    const result =
      await this.equipmentMeasuresRepository.getLatestPluviometerMeasurements({
        id: request.id,
      });

    return right(result || null);
  }
}

export namespace FetchLatestPluviometerMeasurementsProtocol {
  export type Request = {
    id: number;
  };
  export type Response = PluviometerReadEntity | null;
}

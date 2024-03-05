import { Either, right } from "../../../shared/Either";
import { PluviometerReadEntity } from "../../entities/equipments/PluviometerRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchPluviometerReadsByIdRead {
  private readonly equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(
    equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol
  ) {
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
  }
  async execute(
    request: FetchPluviometerReadsByIdReadProtocol.Request
  ): Promise<Either<Error, FetchPluviometerReadsByIdReadProtocol.Response>> {
    const result =
      await this.equipmentMeasuresRepository.getPluviometerReadsByIdRead({
        idRead: request.idRead,
      });

    return right(result || null);
  }
}

export namespace FetchPluviometerReadsByIdReadProtocol {
  export type Request = {
    idRead: number;
  };
  export type Response = PluviometerReadEntity | null;
}

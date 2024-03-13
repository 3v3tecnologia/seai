import { Either, right } from "../../../shared/Either";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchPluviometersReadsWithLastMeasurements {
  private readonly equipmentRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentRepository: EquipmentsRepositoryProtocol) {
    this.equipmentRepository = equipmentRepository;
  }
  async execute(
    request: FetchPluviometersReadsWithLastMeasurementsProtocol.Request
  ): Promise<
    Either<Error, FetchPluviometersReadsWithLastMeasurementsProtocol.Response>
  > {
    const result =
      await this.equipmentRepository.getPluviometersWithLastMeasurements();

    return right(result || null);
  }
}

export namespace FetchPluviometersReadsWithLastMeasurementsProtocol {
  export type Request = void;
  export type Response = Array<any> | null;

  export interface UseCase {
    execute(
      request: FetchPluviometersReadsWithLastMeasurementsProtocol.Request
    ): Promise<
      Either<Error, FetchPluviometersReadsWithLastMeasurementsProtocol.Response>
    >;
  }
}

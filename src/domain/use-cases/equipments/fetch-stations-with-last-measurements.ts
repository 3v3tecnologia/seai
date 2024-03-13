import { Either, right } from "../../../shared/Either";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchStationReadsWithLastMeasurements {
  private readonly equipmentRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentRepository: EquipmentsRepositoryProtocol) {
    this.equipmentRepository = equipmentRepository;
  }
  async execute(
    request: FetchStationReadsWithLastMeasurementsProtocol.Request
  ): Promise<
    Either<Error, FetchStationReadsWithLastMeasurementsProtocol.Response>
  > {
    const result =
      await this.equipmentRepository.getStationsWithLastMeasurements();

    return right(result || null);
  }
}

export namespace FetchStationReadsWithLastMeasurementsProtocol {
  export type Request = void;
  export type Response = Array<any> | null;

  export interface UseCase {
    execute(
      request: FetchStationReadsWithLastMeasurementsProtocol.Request
    ): Promise<
      Either<Error, FetchStationReadsWithLastMeasurementsProtocol.Response>
    >;
  }
}

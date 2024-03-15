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
    let params: {
      latitude: number;
      longitude: number;
      distance: number;
    } | null = null;

    if (request) {
      params = {
        latitude: request.latitude,
        longitude: request.longitude,
        distance: 1000,
      };

      if (Reflect.has(request, "distance") && request.distance) {
        Object.assign(params, {
          distance: request.distance,
        });
      }
    }
    const result =
      await this.equipmentRepository.getPluviometersWithLastMeasurements(
        params
      );

    return right(result || null);
  }
}

export namespace FetchPluviometersReadsWithLastMeasurementsProtocol {
  export type Request = {
    latitude: number;
    longitude: number;
    distance?: number;
  } | null;
  export type Response = Array<any> | null;

  export interface UseCase {
    execute(
      request: FetchPluviometersReadsWithLastMeasurementsProtocol.Request
    ): Promise<
      Either<Error, FetchPluviometersReadsWithLastMeasurementsProtocol.Response>
    >;
  }
}

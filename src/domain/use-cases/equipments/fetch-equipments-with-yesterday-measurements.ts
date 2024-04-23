import { Either, right } from "../../../shared/Either";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchEquipmentsWithYesterdayMeasurements {
  private readonly equipmentRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentRepository: EquipmentsRepositoryProtocol) {
    this.equipmentRepository = equipmentRepository;
  }
  async execute(
    request: FetchEquipmentsWithYesterdayMeasurementsProtocol.Request
  ): Promise<
    Either<Error, FetchEquipmentsWithYesterdayMeasurementsProtocol.Response>
  > {
    let params: {
      latitude: number;
      longitude: number;
      distance?: number;
    } | null = null;

    if (
      [
        Reflect.has(request, "latitude"),
        Reflect.has(request, "longitude"),
      ].every((param) => param == true)
    ) {
      params = {
        latitude: request.latitude as number,
        longitude: request.longitude as number,
        distance: 1000,
      };

      if (Reflect.has(request, "distance") && request.distance) {
        params.distance = request.distance as number;
      }
    }

    switch (request?.type) {
      case "station":
        return right(
          await this.equipmentRepository.getStationsWithYesterdayMeasurements(
            params
          )
        );
      case "pluviometer":
        return right(
          await this.equipmentRepository.getPluviometersWithYesterdayMeasurements(
            params
          )
        );
      default:
        return right(null);
    }
  }
}

export namespace FetchEquipmentsWithYesterdayMeasurementsProtocol {
  export type Request = {
    type: "station" | "pluviometer";
  } & {
    latitude?: number;
    longitude?: number;
    distance?: number;
  };
  export type Response = Array<any> | null;

  export interface UseCase {
    execute(
      request: FetchEquipmentsWithYesterdayMeasurementsProtocol.Request
    ): Promise<
      Either<Error, FetchEquipmentsWithYesterdayMeasurementsProtocol.Response>
    >;
  }
}

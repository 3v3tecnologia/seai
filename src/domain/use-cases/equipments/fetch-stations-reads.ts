import { Either, right } from "../../../shared/Either";
import { StationReadEntity } from "../../entities/equipments/StationRead";
import { IInputWithPagination } from "../_ports/repositories/dto/input";
import { IOuputWithPagination } from "../_ports/repositories/dto/output";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class FetchStationsReads {
  private readonly equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(
    equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol
  ) {
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
  }
  async execute(
    request: FetchStationsReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchStationsReadsUseCaseProtocol.Response>> {
    console.log("[request] :: ", request);
    const dto = {
      idEquipment: request.idEquipment,
      time: Reflect.has(request, "time") ? request.time! : null,
      ...formatPaginationInput(request.pageNumber, request.limit),
    };

    console.log(dto);

    const result = await this.equipmentMeasuresRepository.getStationsReads(dto);

    return right(result);
  }
}

export namespace FetchStationsReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    time?: {
      start: string;
      end: string | null;
    } | null;
  } & IInputWithPagination;
  export type Response = IOuputWithPagination<StationReadEntity> | null;
}

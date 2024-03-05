import { Either, right } from "../../../shared/Either";
import { StationReadEntity } from "../../entities/equipments/StationRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class FetchStationsReads {
  private LIMIT: number = 40;
  private PAGE_NUMBER: number = 0;
  private readonly equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(
    equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol
  ) {
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
  }
  async execute(
    request: FetchStationsReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchStationsReadsUseCaseProtocol.Response>> {
    const dto = {
      idEquipment: request.idEquipment,
      time: Reflect.has(request, "time") ? request.time! : null,
      ...formatPaginationInput(request.pageNumber, request.limit),
    };

    const result = await this.equipmentMeasuresRepository.getStationsReads(dto);

    let pages = result?.count ? Math.ceil(result.count / dto.limit) : 0;

    return right({
      Measures: result?.data || [],
      PageNumber: dto.pageNumber,
      QtdRows: Number(result?.count) || 0,
      PageLimitRows: dto.limit,
      QtdPages: pages,
    });
  }
}

export namespace FetchStationsReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
    limit: number;
    time?: {
      start: string;
      end: string | null;
    } | null;
  };
  export type Response = {
    Measures: Array<StationReadEntity> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
    QtdPages: number;
  } | null;
}

import { Either, right } from "../../../shared/Either";
import { StationReadEntity } from "../../entities/equipments/StationRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

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
    const { idEquipment, pageNumber } = request;

    const page = pageNumber || 0;

    const data = await this.equipmentMeasuresRepository.getStationsReads({
      idEquipment,
      pageNumber: page,
    });

    const result = {
      Measures: data || [],
      PageNumber: Number(page),
      QtdRows: data?.length || 0,
      PageLimitRows: 30,
    };

    return right(result);
  }
}

export namespace FetchStationsReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
  };
  export type Response = {
    Measures: Array<StationReadEntity> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
  } | null;
}

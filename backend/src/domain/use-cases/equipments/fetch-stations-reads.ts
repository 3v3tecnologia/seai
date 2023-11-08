import { Either, right } from "../../../shared/Either";
import { StationReadEntity } from "../../entities/equipments/StationRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchStationsReads {
  private LIMIT:number = 40
  private PAGE_NUMBER:number = 0
  private readonly equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(
    equipmentMeasuresRepository: EquipmentsMeasuresRepositoryProtocol
  ) {
    this.equipmentMeasuresRepository = equipmentMeasuresRepository;
  }
  async execute(
    request: FetchStationsReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchStationsReadsUseCaseProtocol.Response>> {

    const pageNumber = request.pageNumber || this.PAGE_NUMBER
    const limit = request.limit || this.LIMIT
    const time = Reflect.has(request,'time') ? request.time! : null

    const result = await this.equipmentMeasuresRepository.getStationsReads({
      idEquipment:request.idEquipment,
      pageNumber,
      limit,
      time
    });

    let pages = result?.count ? Math.ceil((result.count / limit)) : 0

    return right({
      Measures: result?.data || [],
      PageNumber: pageNumber,
      QtdRows: result?.count || 0,
      PageLimitRows: limit,
      QtdPages: pages
    });
  }
}

export namespace FetchStationsReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
    limit:number;
    time?:{
      start: string;
      end: string | null;
    } | null
  };
  export type Response = {
    Measures: Array<StationReadEntity> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
    QtdPages: number;
  } | null;
}

import { Either, right } from "../../../shared/Either";

import { PluviometerReadEntity } from "../../entities/equipments/PluviometerRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchPluviometersReads {
  private LIMIT:number = 40
  private PAGE_NUMBER:number = 0
  private readonly measuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(measuresRepository: EquipmentsMeasuresRepositoryProtocol) {
    this.measuresRepository = measuresRepository;
  }
  async execute(
    request: FetchPluviometersReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchPluviometersReadsUseCaseProtocol.Response>> {
    const pageNumber = request.pageNumber || this.PAGE_NUMBER
    const limit = request.limit || this.LIMIT
    const time = Reflect.has(request,'time') ? request.time! : null

    const result = await this.measuresRepository.getPluviometersReads({
      idEquipment: request.idEquipment,
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

export namespace FetchPluviometersReadsUseCaseProtocol {
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
    Measures: Array<PluviometerReadEntity> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
    QtdPages: number
  } | null;
}

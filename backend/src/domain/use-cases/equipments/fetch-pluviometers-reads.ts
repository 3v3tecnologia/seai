import { Either, right } from "../../../shared/Either";

import { PluviometerReadEntity } from "../../entities/equipments/PluviometerRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchPluviometersReads {
  private LIMIT: number = 40;
  private PAGE_NUMBER: number = 0;
  private readonly measuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(measuresRepository: EquipmentsMeasuresRepositoryProtocol) {
    this.measuresRepository = measuresRepository;
  }
  async execute(
    request: FetchPluviometersReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchPluviometersReadsUseCaseProtocol.Response>> {
    const pageNumber = request.pageNumber
      ? Number(request.pageNumber)
      : this.PAGE_NUMBER;

    const limit = request.limit ? Number(request.limit) : this.LIMIT;

    const dto = {
      idEquipment: request.idEquipment,
      pageNumber: request.pageNumber || 1,
      limit,
    };

    if (request.start) {
      Object.assign(dto, {
        time: {
          start: request.start,
          end: request.end || null,
        },
      });
    }

    const result = await this.measuresRepository.getPluviometersReads(dto);

    let pages = result?.count ? Math.ceil(result.count / limit) : 0;

    return right({
      Measures: result?.data || [],
      PageNumber: pageNumber,
      QtdRows: Number(result?.count) || 0,
      PageLimitRows: limit,
      QtdPages: pages,
    });
  }
}

export namespace FetchPluviometersReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
    limit: number;
    start?: string | null;
    end?: string | null;
  };
  export type Response = {
    Measures: Array<PluviometerReadEntity> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
    QtdPages: number;
  } | null;
}

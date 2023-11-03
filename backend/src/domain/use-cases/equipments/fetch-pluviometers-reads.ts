import { Either, right } from "../../../shared/Either";

import { PluviometerReadEntity } from "../../entities/equipments/PluviometerRead";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchPluviometersReads {
  private readonly measuresRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(measuresRepository: EquipmentsMeasuresRepositoryProtocol) {
    this.measuresRepository = measuresRepository;
  }
  async execute(
    request: FetchPluviometersReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchPluviometersReadsUseCaseProtocol.Response>> {
    const { idEquipment, pageNumber } = request;

    const page = pageNumber || 0;

    const data = await this.measuresRepository.getPluviometersReads({
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

export namespace FetchPluviometersReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
  };
  export type Response = {
    Measures: Array<PluviometerReadEntity> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
  } | null;
}

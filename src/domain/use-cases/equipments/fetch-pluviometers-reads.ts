import { Either, right } from "../../../shared/Either";

import { PluviometerReadEntity } from "../../entities/equipments/PluviometerRead";
import { IInputWithPagination } from "../_ports/repositories/dto/input";
import { IOuputWithPagination } from "../_ports/repositories/dto/output";

import { IEquipmentsMeasuresRepository } from "../_ports/repositories/equipments-measurements.repository";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class FetchPluviometersReads {
  private readonly measuresRepository: IEquipmentsMeasuresRepository;

  constructor(measuresRepository: IEquipmentsMeasuresRepository) {
    this.measuresRepository = measuresRepository;
  }
  async execute(
    request: FetchPluviometersReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchPluviometersReadsUseCaseProtocol.Response>> {
    const dto = {
      idEquipment: request.idEquipment,
      ...formatPaginationInput(request.pageNumber, request.limit),
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

    return right(result);
  }
}

export namespace FetchPluviometersReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    start?: string | null;
    end?: string | null;
  } & IInputWithPagination;
  export type Response = IOuputWithPagination<PluviometerReadEntity> | null;
}

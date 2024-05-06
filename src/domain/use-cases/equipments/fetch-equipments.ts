import { Either, right } from "../../../shared/Either";
import { EquipmentEntity } from "../../entities/equipments/Equipment";
import { IInputWithPagination } from "../_ports/repositories/dto/input";
import { IOuputWithPagination } from "../_ports/repositories/dto/output";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class FetchEquipments {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: FetchEquipmentsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchEquipmentsUseCaseProtocol.Response>> {
    if (request.equipmentId) {
      const equipment = await this.equipmentsRepository.getEquipmentId(
        request.equipmentId
      );
      return right(equipment);
    }

    const dto = {
      ...formatPaginationInput(request.pageNumber, request.limit),
    };

    if (request.idOrgan) {
      Object.assign(dto, {
        idOrgan: request.idOrgan,
      });
    }

    if (request.name) {
      Object.assign(dto, {
        name: request.name,
      });
    }

    if (request.idType) {
      Object.assign(dto, {
        idType: request.idType,
      });
    }

    const result = await this.equipmentsRepository.getEquipments(dto);

    return right(result);
  }
}
export namespace FetchEquipmentsUseCaseProtocol {
  export type Request = {
    equipmentId?: number;
    idOrgan?: number;
    idType?: number;
    name?: string;
  } & IInputWithPagination;
  export type Response =
    | IOuputWithPagination<EquipmentEntity>
    | EquipmentEntity
    | null;
}

import { Either, right } from "../../../shared/Either";
import { EquipmentEntity } from "../core/models/Equipment";

import { EquipmentsRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/equipments-repository";
import { formatPaginationInput } from "../../../shared/core/formatPaginationInput";
import { IOutputWithPagination, IPaginationInput } from "../../../shared/core/pagination";

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

    const result = await this.equipmentsRepository.getEquipments(request);

    return right(result);
  }
}
export namespace FetchEquipmentsUseCaseProtocol {
  export type Request = {
    equipmentId?: number;
    idOrgan?: number;
    idType?: number;
    name?: string;
  } & IPaginationInput;
  export type Response =
    | IOutputWithPagination<EquipmentEntity>
    | EquipmentEntity
    | null;
}

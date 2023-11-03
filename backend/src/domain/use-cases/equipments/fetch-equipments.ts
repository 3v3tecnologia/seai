import { Either, right } from "../../../shared/Either";
import { EquipmentEntity } from "../../entities/equipments/Equipment";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchEquipments {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: FetchEquipmentsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchEquipmentsUseCaseProtocol.Response>> {
    const { pageNumber } = request;

    const page = pageNumber || 0;
    const data = await this.equipmentsRepository.getEquipments(page);

    const result = {
      Equipments: data || [],
      PageNumber: Number(page),
      QtdRows: data?.length || 0,
      PageLimitRows: 90,
    };

    return right(result);
  }
}

export namespace FetchEquipmentsUseCaseProtocol {
  export type Request = {
    pageNumber: number;
  };
  export type Response = {
    Equipments: Array<EquipmentEntity> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
  } | null;
}

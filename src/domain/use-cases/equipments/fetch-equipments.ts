import { Either, right } from "../../../shared/Either";
import { EquipmentEntity } from "../../entities/equipments/Equipment";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchEquipments {
  private LIMIT: number = 40;
  private PAGE_NUMBER: number = 0;
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: FetchEquipmentsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchEquipmentsUseCaseProtocol.Response>> {
    if(request.equipmentId){
      const equipment = await this.equipmentsRepository.getEquipmentId(request.equipmentId)
      return right(equipment)
    }

    const dto = {
      limit: Number(request.limit) || this.LIMIT,
      pageNumber: Number(request.pageNumber) || this.PAGE_NUMBER,
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

    return right({
      Equipments: result?.data || [],
      PageNumber: Number(dto.pageNumber) || 0,
      QtdRows: result?.count || 0,
      PageLimitRows: dto.limit,
      Total: result?.total || 0,
      TotalPages: result?.totalPages || 0
    });
  }
}
export namespace FetchEquipmentsUseCaseProtocol {
  export type Request = {
    equipmentId?:number;
    pageNumber: number;
    limit: number;
    idOrgan?: number;
    idType?: number;
    name?: string;
  };
  export type Response = {
    Equipments: Array<EquipmentEntity> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
    Total: number;
    TotalPages: number;
  } | EquipmentEntity | null;
}

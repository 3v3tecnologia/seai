import { Either, right } from "../../../shared/Either";
import {
  EquipmentsRepositoryProtocol,
  StationRead,
} from "../_ports/repositories/equipments-repository";

export class FetchStationsReads {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: FetchStationsReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchStationsReadsUseCaseProtocol.Response>> {
    const { idEquipment, pageNumber } = request;

    const data = await this.equipmentsRepository.getStationsReads(
      idEquipment,
      pageNumber
    );

    return right(data);
  }
}

export namespace FetchStationsReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
  };
  export type Response = Array<StationRead> | null;
}

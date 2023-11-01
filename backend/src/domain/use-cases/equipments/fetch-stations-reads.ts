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

    const page = pageNumber || 0;

    const data = await this.equipmentsRepository.getStationsReads(
      idEquipment,
      page
    );

    const result = {
      Measures: data || [],
      PageNumber: Number(page),
      QtdRows: data?.length || 0,
      PageLimitRows: 30,
    };

    return right(result);
  }
}

export namespace FetchStationsReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
  };
  export type Response = {
    Measures: Array<StationRead> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
  } | null;
}

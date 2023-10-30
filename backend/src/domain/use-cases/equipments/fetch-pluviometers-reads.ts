import { Either, right } from "../../../shared/Either";
import {
  EquipmentsRepositoryProtocol,
  PluviometerRead,
} from "../_ports/repositories/equipments-repository";

export class FetchPluviometersReads {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: FetchPluviometersReadsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchPluviometersReadsUseCaseProtocol.Response>> {
    const { idEquipment, pageNumber } = request;

    const page =  pageNumber || 0

    const data = await this.equipmentsRepository.getPluviometersReads(
      idEquipment,
      page
    );

    const result = {
      Measures: data || [],
      PageNumber: Number(page),
      QtdRows: data?.length || 0,
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
    Measures: Array<PluviometerRead> | null;
    PageNumber: number;
    QtdRows: number;
  } | null;
}

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

    const data = await this.equipmentsRepository.getPluviometersReads(
      idEquipment,
      pageNumber
    );

    return right(data);
  }
}

export namespace FetchPluviometersReadsUseCaseProtocol {
  export type Request = {
    idEquipment: number;
    pageNumber: number;
  };
  export type Response = Array<PluviometerRead> | null;
}

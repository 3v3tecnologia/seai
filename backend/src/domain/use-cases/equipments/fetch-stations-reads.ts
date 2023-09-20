import { Either, right } from "../../../shared/Either";
import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchStationsReads {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(): Promise<Either<Error, Array<any> | null>> {
    const data = await this.equipmentsRepository.getStationsReads();

    return right(data);
  }
}

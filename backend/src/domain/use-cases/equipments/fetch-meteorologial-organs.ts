import { Either, right } from "../../../shared/Either";
import { MeteorologicalOrganEntity } from "../../entities/equipments/MetereologicalOrgan";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class FetchMeteorologicalOrgans {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(): Promise<
    Either<Error, FetchMeteorologicalOrgansUseCaseProtocol.Response>
  > {
    const data = await this.equipmentsRepository.getMeteorologicalOrgans();

    return right(data);
  }
}

export namespace FetchMeteorologicalOrgansUseCaseProtocol {
  export type Request = {
    pageNumber: number;
  };
  export type Response = Array<
    Omit<MeteorologicalOrganEntity, "Password">
  > | null;
}

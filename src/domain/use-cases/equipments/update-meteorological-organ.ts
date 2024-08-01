import { Either, left, right } from "../../../shared/Either";
import { MeteorologicalOrganEntity } from "../../entities/equipments/MetereologicalOrgan";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class UpdateMeteorologicalOrgan {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: UpdateMeteorologicalOrganUseCaseProtocol.Request
  ): Promise<Either<Error, UpdateMeteorologicalOrganUseCaseProtocol.Response>> {
    const isOrganAlreadyExists =
      await this.equipmentsRepository.checkIfOrganExists(request.Id);

    if (isOrganAlreadyExists === false) {
      return left(new Error(`Órgão não existe.`));
    }

    await this.equipmentsRepository.updateMeteorologicalOrgan(request);

    return right(`Sucesso ao criar órgão ${request.Id}.`);
  }
}

export namespace UpdateMeteorologicalOrganUseCaseProtocol {
  export type Request = Required<MeteorologicalOrganEntity>;

  export type Response = string;
}

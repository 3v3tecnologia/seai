import { Either, left, right } from "../../../shared/Either";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class DeleteMeteorologicalOrgan {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: DeleteMeteorologicalOrganProtocol.Request
  ): Promise<Either<Error, DeleteMeteorologicalOrganProtocol.Response>> {
    const isOrganAlreadyExists =
      await this.equipmentsRepository.checkIfOrganExists(request.IdOrgan);

    if (isOrganAlreadyExists === false) {
      return left(new Error(`Órgão não encontrado.`));
    }

    const organId = await this.equipmentsRepository.deleteMeteorologicalOrgan(
      request.IdOrgan
    );

    console.log("[UpdateMeteorologicalOrgan] > ", organId);

    return right(`Sucesso ao deletar órgão ${request.IdOrgan}.`);
  }
}

export namespace DeleteMeteorologicalOrganProtocol {
  export type Request = {
    IdOrgan: number;
  };

  export type Response = string;
}

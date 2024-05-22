import { Either, left, right } from "../../../shared/Either";
import { MeteorologicalOrganEntity } from "../core/models/MetereologicalOrgan";
import { Command } from "../../../shared/core/command";

import { EquipmentsRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/equipments-repository";

export class UpdateMeteorologicalOrgan extends Command {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    super();
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

    const organId = await this.equipmentsRepository.updateMeteorologicalOrgan(
      request
    );

    // TO-DO : add actions and table name as global constants
    this.addLog({
      action: "update",
      table: "MetereologicalOrganEquipment",
      description: `Sucesso ao atualizar órgão ${request.Id}.`,
    });

    return right(`Sucesso ao criar órgão ${request.Id}.`);
  }
}

export namespace UpdateMeteorologicalOrganUseCaseProtocol {
  export type Request = Required<MeteorologicalOrganEntity>;

  export type Response = string;
}

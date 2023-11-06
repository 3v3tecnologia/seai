import { Either, left, right } from "../../../shared/Either";
import { MeteorologicalOrganEntity } from "../../entities/equipments/MetereologicalOrgan";
import { Command } from "../_ports/core/command";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

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
      await this.equipmentsRepository.checkIfOrganExists(request.IdOrgan);

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
      description: `Sucesso ao atualizar órgão ${request.IdOrgan}.`,
    });

    return right(`Sucesso ao criar órgão ${request.IdOrgan}.`);
  }
}

export namespace UpdateMeteorologicalOrganUseCaseProtocol {
  export type Request = Required<MeteorologicalOrganEntity>;

  export type Response = string;
}

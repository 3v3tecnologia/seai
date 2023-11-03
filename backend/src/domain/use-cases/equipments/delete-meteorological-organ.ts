import { Either, left, right } from "../../../shared/Either";
import { MeteorologicalOrganEntity } from "../../entities/equipments/MetereologicalOrgan";
import { Command } from "../_ports/core/command";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class DeleteMeteorologicalOrgan extends Command {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    super();
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

    // TO-DO : add actions and table name as global constants
    this.addLog({
      action: "delete",
      table: "MetereologicalOrganEquipment",
      description: `Sucesso ao deletar órgão ${request.IdOrgan}.`,
    });

    return right(`Sucesso ao deletar órgão ${request.IdOrgan}.`);
  }
}

export namespace DeleteMeteorologicalOrganProtocol {
  export type Request = {
    IdOrgan: number;
  };

  export type Response = string;
}

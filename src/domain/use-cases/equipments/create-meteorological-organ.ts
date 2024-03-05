import { Either, left, right } from "../../../shared/Either";
import { MeteorologicalOrganEntity } from "../../entities/equipments/MetereologicalOrgan";
import { Command } from "../_ports/core/command";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class CreateMeteorologicalOrgan extends Command {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    super();
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: CreateMeteorologicalOrganUseCaseProtocol.Request
  ): Promise<Either<Error, CreateMeteorologicalOrganUseCaseProtocol.Response>> {
    const isOrganAlreadyExists =
      await this.equipmentsRepository.checkIfOrganNameAlreadyExists(
        request.Name
      );

    if (isOrganAlreadyExists === true) {
      return left(new Error(`Órgão já existe.`));
    }

    const organId = await this.equipmentsRepository.createMeteorologicalOrgan(
      request
    );

    // TO-DO : add actions and table name as global constants
    this.addLog({
      action: "create",
      table: "MetereologicalOrganEquipment",
      description: `Sucesso ao criar órgão ${organId}.`,
    });

    return right(`Sucesso ao criar órgão ${organId}.`);
  }
}

export namespace CreateMeteorologicalOrganUseCaseProtocol {
  export type Request = Required<Omit<MeteorologicalOrganEntity, "Id">>;

  export type Response = string;
}

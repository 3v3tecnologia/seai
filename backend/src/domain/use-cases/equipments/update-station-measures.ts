import { Either, left, right } from "../../../shared/Either";
import { MeteorologicalOrganEntity } from "../../entities/equipments/MetereologicalOrgan";
import { Command } from "../_ports/core/command";

import {
  EquipmentsMeasuresRepositoryProtocol,
  EquipmentsRepositoryProtocol,
} from "../_ports/repositories/equipments-repository";

export class UpdateStationMeasures extends Command {
  private readonly equipmentsRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsMeasuresRepositoryProtocol) {
    super();
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: UpdateMeteorologicalOrganUseCaseProtocol.Request
  ): Promise<Either<Error, UpdateMeteorologicalOrganUseCaseProtocol.Response>> {
    await this.equipmentsRepository.updateStationMeasures(request);

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

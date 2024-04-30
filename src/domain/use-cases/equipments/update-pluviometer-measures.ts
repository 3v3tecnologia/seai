import { Either, left, right } from "../../../shared/Either";
import { MeteorologicalOrganEntity } from "../../entities/equipments/MetereologicalOrgan";
import { Command } from "../_ports/core/command";

import { IEquipmentsMeasuresRepository } from "../_ports/repositories/equipments-measurements.repository";

export class UpdatePluviometerMeasures extends Command {
  private readonly equipmentsRepository: IEquipmentsMeasuresRepository;

  constructor(equipmentsRepository: IEquipmentsMeasuresRepository) {
    super();
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: UpdatePluviometerMeasuresUseCaseProtocol.Request
  ): Promise<Either<Error, UpdatePluviometerMeasuresUseCaseProtocol.Response>> {
    const measureExists =
      await this.equipmentsRepository.checkIfPluviometerMeasurementsExists({
        id: request.IdRead,
      });

    if (measureExists === null) {
      return left(new Error("Medição não encontrada"));
    }

    await this.equipmentsRepository.updatePluviometerMeasures(request);

    // TO-DO : add actions and table name as global constants
    this.addLog({
      action: "update",
      table: "ReadPluviometer",
      description: `Sucesso ao atualizar leitura de pluviômetro ${request.IdRead}.`,
    });

    return right(
      `Sucesso ao atualizar leitura de pluviômetro ${request.IdRead}.`
    );
  }
}

export namespace UpdatePluviometerMeasuresUseCaseProtocol {
  export type Request = {
    IdRead: number;
    Precipitation: number | null;
  };

  export type Response = string;
}

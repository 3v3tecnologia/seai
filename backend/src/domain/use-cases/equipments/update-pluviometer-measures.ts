import { Either, left, right } from "../../../shared/Either";
import { MeteorologicalOrganEntity } from "../../entities/equipments/MetereologicalOrgan";
import { Command } from "../_ports/core/command";

import { EquipmentsMeasuresRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class UpdatePluviometerMeasures extends Command {
  private readonly equipmentsRepository: EquipmentsMeasuresRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsMeasuresRepositoryProtocol) {
    super();
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: UpdatePluviometerMeasuresUseCaseProtocol.Request
  ): Promise<Either<Error, UpdatePluviometerMeasuresUseCaseProtocol.Response>> {
    const hasMeasuresWithSameTime =
      await this.equipmentsRepository.checkIfPluviometerMeasureTimeAlreadyExists(
        request.Time
      );
    if (hasMeasuresWithSameTime) {
      return left(new Error("Foi encontrado uma medição com o mesmo tempo."));
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
    Time: string;
    Hour: number | null;
    Value: number | null;
  };

  export type Response = string;
}

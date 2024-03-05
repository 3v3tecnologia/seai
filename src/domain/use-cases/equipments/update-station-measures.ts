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
    request: UpdateStationMeasuresUseCaseProtocol.Request
  ): Promise<Either<Error, UpdateStationMeasuresUseCaseProtocol.Response>> {
    const measureExists =
      await this.equipmentsRepository.getStationReadsByIdRead({
        idRead: request.IdRead,
      });

    if (measureExists === null) {
      return left(new Error("Medição não encontrada"));
    }
    const hasMeasuresWithSameTime =
      await this.equipmentsRepository.checkIfStationMeasureTimeAlreadyExists({
        idRead: request.IdRead,
        time: request.Time,
      });
    if (hasMeasuresWithSameTime) {
      return left(new Error("Foi encontrado uma medição com o mesmo tempo."));
    }

    await this.equipmentsRepository.updateStationMeasures(request);

    // TO-DO : add actions and table name as global constants
    this.addLog({
      action: "update",
      table: "ReadStations",
      description: `Sucesso ao atualizar leitura de estação ${request.IdRead}.`,
    });

    return right(`Sucesso ao atualizar leitura de estação ${request.IdRead}.`);
  }
}

export namespace UpdateStationMeasuresUseCaseProtocol {
  export type Request = {
    IdRead: number;
    Time: string;
    Hour: number | null;
    TotalRadiation: number | null;
    AverageRelativeHumidity: number | null;
    MinRelativeHumidity: number | null;
    MaxRelativeHumidity: number | null;
    AverageAtmosphericTemperature: number | null;
    MaxAtmosphericTemperature: number | null;
    MinAtmosphericTemperature: number | null;
    AtmosphericPressure: number | null;
    ETO: number | null;
    WindVelocity: number | null;
  };

  export type Response = string;
}

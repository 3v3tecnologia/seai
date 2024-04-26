import { Either, left, right } from "../../../shared/Either";
import { CalcEto } from "../../entities/equipments/Et0";
import { Command } from "../_ports/core/command";

import { IEquipmentsMeasuresRepository } from "../_ports/repositories/equipments-measurements.repository";

export class UpdateEt0 extends Command {
  private readonly equipmentsMeasurementsRepository: IEquipmentsMeasuresRepository;

  constructor(equipmentsMeasurementsRepository: IEquipmentsMeasuresRepository) {
    super();
    this.equipmentsMeasurementsRepository = equipmentsMeasurementsRepository;
  }
  async execute(
    request: IUpdateEt0MeasurementsUseCase.Request
  ): Promise<Either<Error, IUpdateEt0MeasurementsUseCase.Response>> {
    if (!request.measurements || !request.measurements.length) {
      return left(new Error("Medição não encontrada"));
    }

    const measures =
      await this.equipmentsMeasurementsRepository.getStationsMeasurementsByIds(
        request.measurements
      );

    console.log("[MEASUREMENTS] :: ", measures);

    if (measures === null) {
      return left(new Error("Medição não encontrada"));
    }

    const toPersist = measures.map((measure) => {
      const Et0 = CalcEto({
        date: new Date(measure.Time),
        location: {
          altitude: measure.Altitude as number,
          latitude: measure.Latitude as number,
          longitude: measure.Longitude as number,
        },
        measures: {
          atmosphericPressure: measure.AtmosphericPressure,
          averageAtmosphericTemperature: measure.AverageAtmosphericTemperature,
          averageRelativeHumidity: measure.AverageRelativeHumidity,
          maxAtmosphericTemperature: measure.MaxAtmosphericTemperature,
          maxRelativeHumidity: measure.MaxRelativeHumidity,
          minAtmosphericTemperature: measure.MinAtmosphericTemperature,
          minRelativeHumidity: measure.MinRelativeHumidity,
          totalRadiation: measure.TotalRadiation,
          windVelocity: measure.WindVelocity,
        },
      });

      console.log("[ET0] :: ", Et0);

      return {
        IdRead: measure.IdRead,
        Et0: Et0,
      };
    });

    await this.equipmentsMeasurementsRepository.bulkUpdateEt0(toPersist);

    // TO-DO : add actions and table name as global constants
    this.addLog({
      action: "update",
      table: "ReadStations",
      description: `Sucesso ao atualizar leitura de estação.`,
    });

    return right(`Sucesso ao atualizar leitura de estação.`);
  }
}

export namespace IUpdateEt0MeasurementsUseCase {
  export type Request = {
    measurements: Array<number>;
  };

  export type Response = string;

  export interface UseCase {
    execute(request: Request): Promise<Either<Error, Response>>;
  }
}

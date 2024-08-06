import { UserCommandOperationProps } from "../../../modules/Logs/protocols/logger";
import { Either, left, right } from "../../../shared/Either";
import { CalcEto } from "../../entities/equipments/Et0";

import { IEquipmentsMeasuresRepository } from "../_ports/repositories/equipments-measurements.repository";
import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class UpdateStationMeasurements {
  private readonly equipmentsMeasurementsRepository: IEquipmentsMeasuresRepository;
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(
    equipmentsMeasurementsRepository: IEquipmentsMeasuresRepository,
    equipmentsRepository: EquipmentsRepositoryProtocol
  ) {
    this.equipmentsMeasurementsRepository = equipmentsMeasurementsRepository;
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: {
      IdRead: number;
      TotalRadiation: number | null;
      AverageRelativeHumidity: number | null;
      MinRelativeHumidity: number | null;
      MaxRelativeHumidity: number | null;
      AverageAtmosphericTemperature: number | null;
      MaxAtmosphericTemperature: number | null;
      MinAtmosphericTemperature: number | null;
      AtmosphericPressure: number | null;
      WindVelocity: number | null;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>> {
    const measurements =
      await this.equipmentsMeasurementsRepository.getStationMeasurementsById(
        request.IdRead
      );

    if (measurements === null) {
      return left(new Error("Medição não encontrada"));
    }

    const equipment = await this.equipmentsRepository.getEquipmentId(
      measurements.IdEquipment
    );

    if (equipment == null) {
      return left(new Error("Equipmento não encontrado."));
    }

    const eqpCoordinates = equipment.Location.Coordinates;

    const Et0 = CalcEto({
      date: new Date(measurements.Time),
      location: {
        altitude: equipment.Altitude as number,
        latitude: (eqpCoordinates && eqpCoordinates[0]) || 0,
        longitude: (eqpCoordinates && eqpCoordinates[1]) || 0,
      },
      measures: {
        atmosphericPressure: request.AtmosphericPressure as number,
        averageAtmosphericTemperature:
          request.AverageAtmosphericTemperature as number,
        averageRelativeHumidity: request.AverageRelativeHumidity as number,
        maxAtmosphericTemperature: request.MaxAtmosphericTemperature as number,
        maxRelativeHumidity: request.MaxRelativeHumidity as number,
        minAtmosphericTemperature: request.MinAtmosphericTemperature as number,
        minRelativeHumidity: request.MinRelativeHumidity as number,
        totalRadiation: request.TotalRadiation as number,
        windVelocity: request.WindVelocity as number,
      },
    });

    await this.equipmentsMeasurementsRepository.updateStationMeasures(
      {
        IdRead: request.IdRead,
        AtmosphericPressure: request.AtmosphericPressure as number,
        AverageAtmosphericTemperature:
          request.AverageAtmosphericTemperature as number,
        AverageRelativeHumidity: request.AverageRelativeHumidity as number,
        MaxAtmosphericTemperature: request.MaxAtmosphericTemperature as number,
        MaxRelativeHumidity: request.MaxRelativeHumidity as number,
        MinAtmosphericTemperature: request.MinAtmosphericTemperature as number,
        MinRelativeHumidity: request.MinRelativeHumidity as number,
        TotalRadiation: request.TotalRadiation as number,
        WindVelocity: request.WindVelocity as number,
        Et0: Et0,
      },
      operation
    );

    return right(`Sucesso ao atualizar leitura de estação ${request.IdRead}.`);
  }
}

export interface UpdateStationMeasuresUseCaseProtocol {
  execute(
    request: {
      IdRead: number;
      TotalRadiation: number | null;
      AverageRelativeHumidity: number | null;
      MinRelativeHumidity: number | null;
      MaxRelativeHumidity: number | null;
      AverageAtmosphericTemperature: number | null;
      MaxAtmosphericTemperature: number | null;
      MinAtmosphericTemperature: number | null;
      AtmosphericPressure: number | null;
      WindVelocity: number | null;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>;
}

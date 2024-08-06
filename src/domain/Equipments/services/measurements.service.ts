import { CalcEto } from "../core/models/Et0";
import { Either, left, right } from "../../../shared/Either";
import { IEquipmentsRepository } from "../repositories/protocols/equipment";
import { IEquipmentsMeasurementsRepository } from "../repositories/protocols/measurements";
import { StationReadEntity } from "../core/models/StationRead";
import { PluviometerReadEntity } from "../core/models/PluviometerRead";
import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../Logs/protocols/logger";
import { IEquipmentsMeasurementsServices } from "./protocol/measurements";

export class EquipmentsMeasurementsServices
  implements IEquipmentsMeasurementsServices
{
  constructor(
    private equipmentsRepository: IEquipmentsRepository,
    private equipmentsMeasurementsRepository: IEquipmentsMeasurementsRepository
  ) {}

  async getByEquipmentsCodesAndDate(
    eqpType: "station" | "pluviometer",
    codes: Array<string>,
    date: string
  ): Promise<Either<Error, Array<string>>> {
    let data: Array<string> = [];

    switch (eqpType) {
      case "station":
        data =
          await this.equipmentsMeasurementsRepository.getStationCodesWithMeasurements(
            codes,
            date
          );
        break;
      case "pluviometer":
        data =
          await this.equipmentsMeasurementsRepository.getPluviometersCodesWithMeasurements(
            codes,
            date
          );
        break;
      default:
        return left(new Error("Tipo de equipamentos não reconhecido"));
    }

    return right(data);
  }

  async bulkInsert(params: {
    type: "station" | "pluviometer";
    date: string;
    items: Array<any>;
    id_organ: number;
  }): Promise<Either<Error, string>> {
    const { date, id_organ, items, type } = params;

    if (items.length === 0 || !items) {
      return left(new Error("Necessário informar medições"));
    }

    const alreadyExistsCodes =
      await this.equipmentsMeasurementsRepository.getMeasurementsIdsByTime(
        date,
        type,
        id_organ
      );

    const toInsert = [];
    const toUpdate = [];

    items.forEach((item) => {
      if (type === "station") {
        const Et0 = CalcEto({
          date: new Date(item.Time),
          location: {
            altitude: item.Altitude as number,
            latitude: item.Latitude as number,
            longitude: item.Longitude as number,
          },
          measures: {
            atmosphericPressure: item.AtmosphericPressure as number,
            averageAtmosphericTemperature:
              item.AverageAtmosphericTemperature as number,
            averageRelativeHumidity: item.AverageRelativeHumidity as number,
            maxAtmosphericTemperature: item.MaxAtmosphericTemperature as number,
            maxRelativeHumidity: item.MaxRelativeHumidity as number,
            minAtmosphericTemperature: item.MinAtmosphericTemperature as number,
            minRelativeHumidity: item.MinRelativeHumidity as number,
            totalRadiation: item.TotalRadiation as number,
            windVelocity: item.WindVelocity as number,
          },
        });

        item.Et0 = Et0;
      }

      if (alreadyExistsCodes.has(item.FK_Equipment)) {
        toUpdate.push(item);
        return;
      }

      toInsert.push(item);
    });

    if (toInsert.length)
      await this.equipmentsMeasurementsRepository.bulkInsert(items, type);

    if (toUpdate.length)
      await this.equipmentsMeasurementsRepository.bulkUpdate(items, type);

    await this.equipmentsRepository.insertLastUpdatedAtByOrgan(id_organ);

    return right("Sucesso ao realizar inserções de dados de medições");
  }

  async fetchLatest(request: {
    id: number;
    type: "station" | "pluviometer";
  }): Promise<Either<Error, StationReadEntity | PluviometerReadEntity | null>> {
    switch (request.type) {
      case "station":
        return right(
          await this.equipmentsMeasurementsRepository.getLatestStationMeasurements(
            {
              id: request.id,
            }
          )
        );
      case "pluviometer":
        return right(
          await this.equipmentsMeasurementsRepository.getLatestPluviometerMeasurements(
            {
              id: request.id,
            }
          )
        );
      default:
        return right(null);
    }
  }

  async fetchByPluviometer(
    request: {
      idEquipment: number;
      start?: string | null;
      end?: string | null;
    } & IPaginationInput
  ): Promise<
    Either<Error, IOutputWithPagination<PluviometerReadEntity> | null>
  > {
    return right(
      await this.equipmentsMeasurementsRepository.getPluviometersReads(request)
    );
  }

  async fetchByStation(
    request: {
      idEquipment: number;
      time?: {
        start: string;
        end: string | null;
      } | null;
    } & IPaginationInput
  ): Promise<Either<Error, IOutputWithPagination<StationReadEntity> | null>> {
    return right(
      await this.equipmentsMeasurementsRepository.getStationsReads(request)
    );
  }

  async updateByPluviometer(
    request: {
      IdRead: number;
      Precipitation: number | null;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>> {
    const measureExists =
      await this.equipmentsMeasurementsRepository.checkIfPluviometerMeasurementsExists(
        {
          id: request.IdRead,
        }
      );

    if (measureExists === null) {
      return left(new Error("Medição não encontrada"));
    }

    await this.equipmentsMeasurementsRepository.updatePluviometerMeasures(
      request,
      operation
    );

    return right(
      `Sucesso ao atualizar leitura de pluviômetro ${request.IdRead}.`
    );
  }

  async updateByStation(
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

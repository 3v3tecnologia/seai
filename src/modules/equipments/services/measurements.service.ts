import { CalcEto } from "../../../domain/entities/equipments/Et0";
import { Either, left, right } from "../../../shared/Either";
import { IEquipmentsRepository } from "../repositories/protocols/equipment";
import { IEquipmentsMeasurementsRepository } from "../repositories/protocols/measurements";

export class EquipmentsMeasurementsServices {
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
}

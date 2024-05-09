import { CalcEto } from "../../../domain/entities/equipments/Et0"
import { Either, left, right } from "../../../shared/Either"
import { DbEquipmentsMeasurementsRepository } from "../infra/database/repositories/equipments-measurements.repository"

export namespace bulkUpdateMeasurementsDTO {
    export type Input = {}
    export type Output = {}
}

export type StationMeasurementsToPersist = {
    FK_Equipment: number,
    FK_Organ: number,
    Time: string,
    Hour: number | null,
    Altitude: number | null,
    Longitude: number | null,
    Latitude: number | null,
    TotalRadiation: number | null,
    MaxRelativeHumidity: number | null,
    MinRelativeHumidity: number | null,
    AverageRelativeHumidity: number | null,
    MaxAtmosphericTemperature: number | null,
    MinAtmosphericTemperature: number | null,
    AverageAtmosphericTemperature: number | null,
    AtmosphericPressure: number | null,
    WindVelocity: number | null
    Et0?: number | null
}

export type PluviometerMeasurementsToPersist = {
    FK_Equipment: number,
    FK_Organ: number,
    Time: string,
    Hour: number | null,
    Altitude: number | null,
    Longitude: number | null,
    Latitude: number | null,
    Precipitation: number | null,
}

export class EquipmentsMeasurementsServices {

    static async getByEquipmentsCodesAndDate(eqpType: 'station' | 'pluviometer', codes: Array<string>, date: string): Promise<Either<Error, Array<string>>> {
        let data: Array<string> = []

        switch (eqpType) {
            case "station":
                data = await DbEquipmentsMeasurementsRepository.getStationCodesWithMeasurements(codes, date)
                break;
            case "pluviometer":
                data = await DbEquipmentsMeasurementsRepository.getPluviometersCodesWithMeasurements(codes, date)
                break;
            default:
                return left(new Error("Tipo de equipamentos não reconhecido"))
        }

        return right(data)
    }


    static async bulkInsert(type: 'station' | 'pluviometer', date: string, measurements: Array<any>, id_organ: number): Promise<Either<Error, string>> {
        if (measurements.length === 0 || !measurements) {
            return left(new Error("Necessário informar medições"))
        }

        const alreadyExistsCodes = await DbEquipmentsMeasurementsRepository.getMeasurementsIdsByTime(date, type, id_organ)

        const toInsert = []
        const toUpdate = []

        measurements.forEach((item) => {
            if (type === 'station') {
                const Et0 = CalcEto({
                    date: new Date(item.Time),
                    location: {
                        altitude: item.Altitude as number,
                        latitude: item.Latitude as number,
                        longitude: item.Longitude as number,
                    },
                    measures: {
                        atmosphericPressure: item.AtmosphericPressure as number,
                        averageAtmosphericTemperature: item.AverageAtmosphericTemperature as number,
                        averageRelativeHumidity: item.AverageRelativeHumidity as number,
                        maxAtmosphericTemperature: item.MaxAtmosphericTemperature as number,
                        maxRelativeHumidity: item.MaxRelativeHumidity as number,
                        minAtmosphericTemperature: item.MinAtmosphericTemperature as number,
                        minRelativeHumidity: item.MinRelativeHumidity as number,
                        totalRadiation: item.TotalRadiation as number,
                        windVelocity: item.WindVelocity as number,
                    },
                });

                item.Et0 = Et0
            }

            if (alreadyExistsCodes.has(item.FK_Equipment)) {
                toUpdate.push(item)
                return
            }

            toInsert.push(item)
        });

        if (toInsert.length) await DbEquipmentsMeasurementsRepository.bulkInsert(measurements, type)

        if (toUpdate.length) await DbEquipmentsMeasurementsRepository.bulkUpdate(measurements, type)

        return right("Sucesso ao realizar inserções de dados de medições")
    }

}


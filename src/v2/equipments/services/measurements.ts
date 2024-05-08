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

    static async bulkUpdate(type: 'station' | 'pluviometer', measurements: Array<any>): Promise<Either<Error, Array<number>>> {
        const noMeasurementsProvided = !measurements.length

        if (noMeasurementsProvided) {
            return left(new Error("Necessário informar medições"))
        }

        let ids: Array<number> = []

        switch (type) {
            case "station":
                const toPersist = calcEt0FromList(measurements)
                ids = await DbEquipmentsMeasurementsRepository.updateStations(toPersist)
                break;
            case "pluviometer":
                await DbEquipmentsMeasurementsRepository.updatePluviometers(measurements)
                break;
            default:
                return left(new Error("Tipo de equipamentos não reconhecido"))
        }

        return right(ids)

    }

    static async bulkInsert(type: 'station' | 'pluviometer', measurements: Array<StationMeasurementsToPersist | StationMeasurementsToPersist>): Promise<Either<Error, Array<number>>> {
        const noMeasurementsProvided = !measurements.length


        if (noMeasurementsProvided) {
            return left(new Error("Necessário informar medições"))
        }

        let ids: Array<number> = []

        switch (type) {
            case "station":
                const toPersist = calcEt0FromList(measurements)
                ids = await DbEquipmentsMeasurementsRepository.insertStations(toPersist)
                break;
            case "pluviometer":
                await DbEquipmentsMeasurementsRepository.insertPluviometers(measurements)
                break;
            default:
                return left(new Error("Tipo de equipamentos não reconhecido"))
        }

        return right(ids)
    }

}

function calcEt0FromList(measurements: Array<any>) {
    return measurements.map((item: any) => {
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

        console.log("[ET0] :: ", Et0);

        item.Et0 = Et0

        return item
    });
}
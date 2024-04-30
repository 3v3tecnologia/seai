import { Either, left, right } from "../../../shared/Either"
import { DbEquipmentsMeasurementsRepository } from "../infra/database/repositories/equipments-measurements.repository"

export namespace bulkUpdateMeasurementsDTO {
    export type Input = {}
    export type Output = {}
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
                ids = await DbEquipmentsMeasurementsRepository.updateStations(measurements)
                break;
            case "pluviometer":
                await DbEquipmentsMeasurementsRepository.updatePluviometers(measurements)
                break;
            default:
                return left(new Error("Tipo de equipamentos não reconhecido"))
        }

        return right(ids)

    }

    static async bulkInsert(type: 'station' | 'pluviometer', measurements: Array<{
        FK_Equipment: number,
        FK_Organ: number,
        Time: string,
        Hour: number | null,
        TotalRadiation: number | null,
        MaxRelativeHumidity: number | null,
        MinRelativeHumidity: number | null,
        AverageRelativeHumidity: number | null,
        MaxAtmosphericTemperature: number | null,
        MinAtmosphericTemperature: number | null,
        AverageAtmosphericTemperature: number | null,
        AtmosphericPressure: number | null,
        WindVelocity: number | null
    }>): Promise<Either<Error, Array<number>>> {
        const noMeasurementsProvided = !measurements.length


        if (noMeasurementsProvided) {
            return left(new Error("Necessário informar medições"))
        }

        let ids: Array<number> = []

        switch (type) {
            case "station":
                ids = await DbEquipmentsMeasurementsRepository.insertStations(measurements)
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

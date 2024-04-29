import { Either, left, right } from "../../../shared/Either"
import { DbEquipmentsMeasurementsRepository } from "../infra/database/repositories/equipments-measurements.repository"

export class EquipmentsMeasurementsServices {
    // static async getByEquipmentsCodesAndDate(eqpType: 'station' | 'pluviometer', codes: Array<number>, date: string): Promise<any> {
    //     let data = []

    //     switch (eqpType) {
    //         case "station":
    //             data = await DbEquipmentsMeasurementsRepository.
    //             break;
    //         case "pluviometer":
    //             break;
    //         default:
    //             return left(new Error("Tipo de equipamentos não reconhecido"))
    //     }

    // }

    static async bulkUpdate(type: 'station' | 'pluviometer', measurements: Array<any>): Promise<Either<Error, any>> {
        const noMeasurementsProvided = !measurements.length

        if (noMeasurementsProvided) {
            return left(new Error("Necessário informar medições"))
        }

        switch (type) {
            case "station":
                await DbEquipmentsMeasurementsRepository.updateStations(measurements)
                break;
            case "pluviometer":
                await DbEquipmentsMeasurementsRepository.updatePluviometers(measurements)
                break;
            default:
                return left(new Error("Tipo de equipamentos não reconhecido"))
        }

        return right("Sucesso ao atualizar medições")

    }

    static async bulkInsert(type: 'station' | 'pluviometer', measurements: Array<any>): Promise<Either<Error, any>> {
        const noMeasurementsProvided = !measurements.length

        if (noMeasurementsProvided) {
            return left(new Error("Necessário informar medições"))
        }

        switch (type) {
            case "station":
                await DbEquipmentsMeasurementsRepository.insertStations(measurements)
                break;
            case "pluviometer":
                await DbEquipmentsMeasurementsRepository.insertPluviometers(measurements)
                break;
            default:
                return left(new Error("Tipo de equipamentos não reconhecido"))
        }

        return right("Sucesso ao inserir medições")
    }

}

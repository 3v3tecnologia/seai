import { Either, left, right } from "../../../shared/Either"
import { DbEquipmentsRepository } from "../infra/database/repositories/equipments.repository"

export class EquipmentsServices {
  static async bulkInsert(
    equipments: Array<any>,
    id_organ: number
  ): Promise<Either<Error, Array<{ Code: string, Id: number }>>> {
    if (!equipments.length) {
      return left(new Error("Necessário informar alguma leitura"))
    }
    const codes = await DbEquipmentsRepository.bulkInsert(equipments)

    await DbEquipmentsRepository.insertLastUpdatedAtByOrgan(id_organ)

    return right(codes)
  }

  static async getAllEquipmentsTypes(): Promise<Either<Error, Array<{
    Type: string,
    Name: number
  }>>> {
    return right(await DbEquipmentsRepository.getTypes())
  }

  static async getByType(type: 'station' | 'pluviometer'): Promise<Either<Error, Array<any> | null>> {
    return right(await DbEquipmentsRepository.getByType(type))
  }

  static async getMeteorologicalOrganCredentials(organName: string): Promise<Either<Error, any | null>> {
    return right(await DbEquipmentsRepository.getOrganByName(organName))
  }

  static async getDateOfLastMeasurementTaken(): Promise<Either<Error, Array<any> | null>> {
    return right(await DbEquipmentsRepository.getDateOfLastMeasurementTaken())
  }
}

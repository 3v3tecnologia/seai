import { Either, left, right } from "../../../shared/Either";
import { IEquipmentsRepository } from "../repositories/protocols/equipment";
import { IEquipmentsServices } from "./protocol/equipments";

export class EquipmentsServices implements IEquipmentsServices {
  constructor(private equipmentRepository: IEquipmentsRepository) {}

  async bulkInsert(
    equipments: Array<any>,
    id_organ: number
  ): Promise<Either<Error, Array<{ Code: string; Id: number }>>> {
    if (!equipments.length) {
      return left(new Error("Necessário informar alguma leitura"));
    }
    const codes = await this.equipmentRepository.bulkInsert(equipments);

    await this.equipmentRepository.insertLastUpdatedAtByOrgan(id_organ);

    return right(codes);
  }

  async getAllEquipmentsTypes(): Promise<
    Either<
      Error,
      Array<{
        Type: string;
        Name: number;
      }>
    >
  > {
    return right(await this.equipmentRepository.getTypes());
  }

  async getByType(
    type: "station" | "pluviometer"
  ): Promise<Either<Error, Array<any> | null>> {
    return right(await this.equipmentRepository.getByType(type));
  }

  async getMeteorologicalOrganCredentials(
    organName: string
  ): Promise<Either<Error, any | null>> {
    return right(await this.equipmentRepository.getOrganByName(organName));
  }

  async getDateOfLastMeasurementTaken(): Promise<
    Either<Error, Array<any> | null>
  > {
    return right(
      await this.equipmentRepository.getDateOfLastMeasurementTaken()
    );
  }
}

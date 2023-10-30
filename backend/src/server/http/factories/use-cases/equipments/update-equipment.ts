import { UpdateEquipment } from "../../../../../domain/use-cases/equipments/update-equipment";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeUpdateEquipment = (): UpdateEquipment => {
  const repository = new KnexEquipmentsRepository();
  return new UpdateEquipment(repository);
};

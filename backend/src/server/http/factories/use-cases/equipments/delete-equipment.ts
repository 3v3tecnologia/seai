import { DeleteEquipment } from "../../../../../domain/use-cases/equipments/delete-equipment";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeDeleteEquipment = (): DeleteEquipment => {
  const repository = new KnexEquipmentsRepository();
  return new DeleteEquipment(repository);
};

import { CreateEquipments } from "../../../../../domain/use-cases/equipments/create-equipment";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeCreateEquipment = (): CreateEquipments => {
  const repository = new KnexEquipmentsRepository();
  return new CreateEquipments(repository);
};

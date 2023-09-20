import { FetchEquipments } from "../../../../../domain/use-cases/equipments/fetch-equipments";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeFetchEquipments = (): FetchEquipments => {
  const repository = new KnexEquipmentsRepository();
  return new FetchEquipments(repository);
};

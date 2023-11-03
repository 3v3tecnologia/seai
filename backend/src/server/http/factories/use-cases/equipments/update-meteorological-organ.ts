import { UpdateMeteorologicalOrgan } from "../../../../../domain/use-cases/equipments/update-meteorological-organ";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeUpdateMeteorologicalOrgan = (): UpdateMeteorologicalOrgan => {
  const repository = new KnexEquipmentsRepository();
  return new UpdateMeteorologicalOrgan(repository);
};

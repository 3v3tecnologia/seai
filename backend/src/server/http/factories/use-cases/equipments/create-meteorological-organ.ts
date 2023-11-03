import { CreateMeteorologicalOrgan } from "../../../../../domain/use-cases/equipments/create-meteorological-organ";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeCreateMeteorologicalOrgan = (): CreateMeteorologicalOrgan => {
  const repository = new KnexEquipmentsRepository();
  return new CreateMeteorologicalOrgan(repository);
};

import { DeleteMeteorologicalOrgan } from "../../../../../domain/use-cases/equipments/delete-meteorological-organ";
import { FetchMeteorologicalOrgans } from "../../../../../domain/use-cases/equipments/fetch-meteorologial-organs";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeDeleteMeteorologicalOrgan = (): DeleteMeteorologicalOrgan => {
  const repository = new KnexEquipmentsRepository();
  return new DeleteMeteorologicalOrgan(repository);
};

import { FetchMeteorologicalOrgans } from "../../../../../domain/use-cases/equipments/fetch-meteorologial-organs";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeFetchMeteorologicalOrgan = (): FetchMeteorologicalOrgans => {
  const repository = new KnexEquipmentsRepository();
  return new FetchMeteorologicalOrgans(repository);
};

import { FetchPluviometersReads } from "../../../../../domain/use-cases/equipments/fetch-pluviometers-reads";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeFetchPluviometersReads = (): FetchPluviometersReads => {
  const repository = new KnexEquipmentsRepository();
  return new FetchPluviometersReads(repository);
};

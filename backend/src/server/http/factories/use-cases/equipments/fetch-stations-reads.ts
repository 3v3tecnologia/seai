import { FetchStationsReads } from "../../../../../domain/use-cases/equipments/fetch-stations-reads";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeFetchStationsReads = (): FetchStationsReads => {
  const repository = new KnexEquipmentsRepository();
  return new FetchStationsReads(repository);
};

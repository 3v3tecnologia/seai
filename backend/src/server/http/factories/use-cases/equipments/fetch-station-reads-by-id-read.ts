import { FetchStationReadsByIdRead } from "../../../../../domain/use-cases/equipments/fetch-station-reads-by-id-read";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeFetchStationReadsByIdRead = (): FetchStationReadsByIdRead => {
  const repository = new KnexEquipmentsRepository();
  return new FetchStationReadsByIdRead(repository);
};

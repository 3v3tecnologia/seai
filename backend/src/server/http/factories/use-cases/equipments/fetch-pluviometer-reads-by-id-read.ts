import { FetchPluviometerReadsByIdRead } from "../../../../../domain/use-cases/equipments/fetch-pluviometer-reads-by-id-read";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeFetchPluviometerReadsByIdRead =
  (): FetchPluviometerReadsByIdRead => {
    const repository = new KnexEquipmentsRepository();
    return new FetchPluviometerReadsByIdRead(repository);
  };

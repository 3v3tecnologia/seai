import { UpdatePluviometerMeasures } from "../../../../../domain/use-cases/equipments/update-pluviometer-measures";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeUpdatePluviometerMeasures = (): UpdatePluviometerMeasures => {
  const repository = new KnexEquipmentsRepository();
  return new UpdatePluviometerMeasures(repository);
};

import { UpdateStationMeasures } from "../../../../../domain/use-cases/equipments/update-station-measures";
import { KnexEquipmentsRepository } from "../../../../../infra/database/postgres/repositories/equipments-repository";

export const makeUpdateStationMeasures = (): UpdateStationMeasures => {
  const repository = new KnexEquipmentsRepository();
  return new UpdateStationMeasures(repository);
};

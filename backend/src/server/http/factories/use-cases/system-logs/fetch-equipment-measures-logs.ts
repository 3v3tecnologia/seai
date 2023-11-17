import { FetchEquipmentLogs } from "../../../../../domain/use-cases/use-cases-logs/fetch-equipment-logs";
import { KnexLogOperationsRepository } from "../../../../../infra/database/postgres/repositories/log-operations-repository";

export const makeFetchEquipmentMeasuresLogs = (): FetchEquipmentLogs => {
  return new FetchEquipmentLogs(new KnexLogOperationsRepository());
};

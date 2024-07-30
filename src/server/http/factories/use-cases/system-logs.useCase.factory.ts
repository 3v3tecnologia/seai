import { FetchEquipmentLogs } from "../../../../domain/use-cases/system-logs/fetch-equipment-logs";
import { RegisterUserLogs } from "../../../../domain/use-cases/system-logs/register-user-logs";
import { DbLogOperationsRepository } from "../../../../modules/User/Government/infra/database/repository/user-operations.repository";

export class SystemLogsUseCaseFactory {
  private static repository = new DbLogOperationsRepository();

  static makeRegisterUserLogs(): RegisterUserLogs {
    return new RegisterUserLogs(this.repository);
  }

  static makeFetchEquipmentMeasuresLogs(): FetchEquipmentLogs {
    return new FetchEquipmentLogs(this.repository);
  }
}

import { DbLogOperationsRepository } from "../infra/repositories/log-repository";
import { FetchEquipmentLogs, RegisterUserLogs } from "../services";

export class SystemLogsUseCaseFactory {
    private static repository = new DbLogOperationsRepository();

    static makeRegisterUserLogs(): RegisterUserLogs {
        return new RegisterUserLogs(this.repository);
    }

    static makeFetchEquipmentMeasuresLogs(): FetchEquipmentLogs {
        return new FetchEquipmentLogs(this.repository);
    }
}

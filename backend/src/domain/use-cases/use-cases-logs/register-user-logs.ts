import {
  Actions,
  LogRepositoryProtocol,
} from "../_ports/repositories/log-repository";

export class RegisterUserLogs {
  private readonly logRepository: LogRepositoryProtocol;

  constructor(logRepository: LogRepositoryProtocol) {
    this.logRepository = logRepository;
  }
  async log(id_user: number, actions: Array<Actions>): Promise<void> {
    console.log("Salvando logs do usuário ", id_user);
    await this.logRepository.saveUserActions(id_user, actions);
  }
}

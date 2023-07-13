import { Actions } from "../repositories/log-repository";

export abstract class Command {
  private _logs: Array<Actions> = [];

  useCaseLogs(): Array<Actions> {
    return this._logs;
  }

  protected addLog(logs: Actions): void {
    this._logs.push(logs);
  }
  protected resetLog(): void {
    this._logs = [];
  }
}

import { Actions } from "../repositories/log-repository";

export abstract class Command {
  private _logs: Array<Actions> = [];

  public useCaseLogs(): Array<Actions> {
    return this._logs;
  }

  protected addLog(logs: Actions): void {
    this._logs.push(logs);
  }
  public resetLog(): void {
    if (this._logs.length) {
      this._logs = [];
    }
  }
}

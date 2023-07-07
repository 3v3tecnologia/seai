import { RegisterUserLogs } from "../../../domain/use-cases/use-cases-logs/register-user-logs";
import { Controller } from "./controllers";

export abstract class CommandController<Request = any, Response = any>
  implements Controller<Request>
{
  protected userLogs: RegisterUserLogs;
  constructor(userLogs: RegisterUserLogs) {
    this.userLogs = userLogs;
  }
  abstract handle(request: Request): Promise<Response>;
}

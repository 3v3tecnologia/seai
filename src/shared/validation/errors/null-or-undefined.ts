import { NotificationErrorProps } from "../../notification/protocol/notification-protocol";

export class NullOrUndefinedError
  extends Error
  implements NotificationErrorProps
{
  constructor(field: string) {
    super(`The ${field} é nulo ou indefinido.`);
    this.name = "NullOrUndefinedError";
  }
}

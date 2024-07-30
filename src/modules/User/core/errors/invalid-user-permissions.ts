import { DomainError } from "../../../../shared/errors/domain-error";

export namespace UserModuleAccessErrors {
  export class InvalidUserPermissionError extends Error implements DomainError {
    constructor(msg: string) {
      super(msg);
      this.name = "InvalidUserPermissionError";
    }
  }
  export class InvalidUserAdminPermissionsError
    extends Error
    implements DomainError
  {
    constructor() {
      super(
        "Para usuário administrador, é necessário definir todas as permissões."
      );
      this.name = "InvalidUserAdminPermissionsError";
    }
  }
  export class InvalidBasicUserPermissionsError
    extends Error
    implements DomainError
  {
    constructor() {
      super(
        "Para usuário básico, não deve haver permissão para gerenciar usuários."
      );
      this.name = "InvalidBasicUserPermissionsError";
    }
  }
}

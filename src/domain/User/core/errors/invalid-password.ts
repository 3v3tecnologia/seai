import { DomainError } from "../../../../shared/errors/domain-error";

export namespace PasswordErrors {
  export class EmptyPasswordError extends Error implements DomainError {
    constructor() {
      super(`A senha não deve ser vazia`);
      this.name = "EmptyPasswordError";
    }
  }
  export class PasswordWithoutNumbersError
    extends Error
    implements DomainError
  {
    constructor() {
      super(`Senha deve conter pelo menos um número`);
      this.name = "PasswordWithoutNumbersError";
    }
  }
  export class PasswordLengthError extends Error implements DomainError {
    constructor(min: number) {
      super(`Senha não deve ser menor do que ${min} caracteres`);
      this.name = "PasswordLengthError";
    }
  }
  export class PasswordNotMatchingError extends Error implements DomainError {
    constructor() {
      super(`Senha e Comfirmar senha devem serem iguais`);
      this.name = "PasswordNotMatchingError";
    }
  }
  export class UnmatchedPasswordError extends Error {
    constructor() {
      super("Confirme a senha");
      this.name = "UnmatchedPasswordError";
    }
  }
}

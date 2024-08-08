import { DomainError } from "../../../../shared/errors/domain-error";

export class InvalidLoginError extends Error implements DomainError {
  constructor() {
    super(
      `Login inválido, não deve ser vazio ou nulo e não deve ser maior do que a quantidade de caracteres permitido.`
    );
    this.name = "InvalidLoginError";
  }
}

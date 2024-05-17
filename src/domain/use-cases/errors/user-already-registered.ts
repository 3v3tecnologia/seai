export class UserAlreadyRegisteredError extends Error {
    constructor() {
        super("Usuário já registrado");
        this.name = "UserAlreadyRegisteredError";
    }
}

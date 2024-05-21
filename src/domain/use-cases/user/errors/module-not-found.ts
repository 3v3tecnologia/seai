export class UserModulesNotFound extends Error {
    constructor(moduleName?: string) {
        super(
            moduleName
                ? `Não existe permissão cadastrada para o módulo ${moduleName}.`
                : "Acesso do usuário não existe"
        );
        this.name = "UserModulesNotFound";
    }
}

export class UserModuleIdNotFound extends Error {
    constructor(moduleName: string) {
        super(`Id do módulo ${moduleName} não encontrado.`);
        this.name = "UserModuleIdNotFound";
    }
}

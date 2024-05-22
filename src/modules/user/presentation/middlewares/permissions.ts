import { AccountRepositoryProtocol } from "../../infra/repositories/protocol/user-repository";


export class UserPermissions {
    private readonly accountRepository: AccountRepositoryProtocol;

    constructor(
        accountRepository: AccountRepositoryProtocol,
    ) {
        this.accountRepository = accountRepository;
    }

    async handle(request: UserPermissionsMiddleware.Request) {

    }
}

export namespace UserPermissionsMiddleware {
    export type Request = {
        accountId: number;
    };
}
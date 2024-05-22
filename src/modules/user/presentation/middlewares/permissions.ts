import { AccountRepositoryProtocol } from "../../domain/use-cases/_ports/repositories/account-repository";

export function can(permissionsRoutes: string[]) {
    return async (request: Request, response: Response, next: NextFunction) => {
        const { userId } = request;

        const user = await UserRepository().findOne({
            where: { id: userId },
            relations: ["permissions"],
        });

        if (!user) {
            return response.status(400).json("User does not exists");
        }

        const permissionExists = user.permissions
            .map((permission) => permission.name)
            .some((permission) => permissionsRoutes.includes(permission));

        if (!permissionExists) {
            return response.status(401).end();
        }

        return next();
    };
}

// Admin, Support, Basic...
export function is(rolesRoutes: string[]) {
    return async (request: Request, response: Response, next: NextFunction) => {
        const { userId } = request;

        const user = await UserRepository().findOne({
            where: { id: userId },
            relations: ["roles"],
        });

        if (!user) {
            return response.status(400).json("User does not exists");
        }

        const roleExists = user.roles
            .map((role) => role.name)
            .some((role) => rolesRoutes.includes(role));

        if (!roleExists) {
            return response.status(401).end();
        }

        return next();
    };
}

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
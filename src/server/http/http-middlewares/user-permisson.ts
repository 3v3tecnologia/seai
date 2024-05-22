import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../../../modules/user/factories/presentation/middlewares/admin-middleware-factory";
import { Modules } from "../../../modules/user/core/model/user-modules-access";

// create-user, read-user, 
export const userWriteAccessAuth = (permissions: Array<string>) => adaptMiddleware(
    makePermisson(Modules.USER, {
        write: true,
    })
);

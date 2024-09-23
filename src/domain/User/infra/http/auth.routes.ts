import { Router } from "express";
import { adaptHTTPHandler } from "../../../../server/http/adapters/express-route.adapter";
import { AuthenticationController } from "../../controllers/auth.controller";


export const setupAuthorizationRoute = (): Router => {
    const router = Router();

    router.post(
        "/sign-in",
        adaptHTTPHandler(AuthenticationController.login)
    );

    return router
};

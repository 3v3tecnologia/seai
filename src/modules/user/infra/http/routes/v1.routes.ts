import { Router } from "express";
import { authorization, userReadAccessAuth, userWriteAccessAuth } from "../../../../../server/http/http-middlewares";
import { UserControllersFactory } from "../../../factories/presentation/controllers/user.controller.factory";
import { adaptRoute } from "../../../../../server/http/adapters/express-route.adapter";


export const userRouter = (): Router => {
    const router = Router();

    router.get(
        "/profile",
        authorization,
        adaptRoute(UserControllersFactory.makeFetchUserById())
    );

    router.delete(
        "/profile",
        authorization,
        adaptRoute(UserControllersFactory.makeDeleteUser())
    );

    router.patch(
        "/profile",
        authorization,
        adaptRoute(UserControllersFactory.makeUpdateUserProfile())
    );

    router.post(
        "/",
        authorization,
        userWriteAccessAuth,
        adaptRoute(UserControllersFactory.makeCreateUser())
    );

    router.patch(
        "/:id",
        authorization,
        userWriteAccessAuth,
        adaptRoute(UserControllersFactory.makeUpdateUser())
    );

    router.get(
        "/",
        authorization,
        userReadAccessAuth,
        adaptRoute(UserControllersFactory.makeGetUsers())
    );

    router.get(
        "/:id",
        authorization,
        userReadAccessAuth,
        adaptRoute(UserControllersFactory.makeFetchUserById())
    );

    router.delete(
        "/:id",
        authorization,
        userWriteAccessAuth,
        adaptRoute(UserControllersFactory.makeDeleteUser())
    );
    // Delete by email
    router.delete(
        "/",
        authorization,
        adaptRoute(UserControllersFactory.makeDeleteUser())
    );

    router.post("/sign-in", adaptRoute(UserControllersFactory.makeSignIn()));

    router.patch(
        "/complete-registration/:code",
        adaptRoute(UserControllersFactory.makeCompleteUserRegister())
    );

    router.post(
        "/password/reset/:code",
        adaptRoute(UserControllersFactory.makeResetUser())
    );

    router.post(
        "/password/forgot",
        adaptRoute(UserControllersFactory.makeForgotPassword())
    );

    // router.post(
    //   "/sign-up",
    //   authorization,
    //   adaptRoute(UserControllersFactory.makeSignUp())
    // );

    return router;
};

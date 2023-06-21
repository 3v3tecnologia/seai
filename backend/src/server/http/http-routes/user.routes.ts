import { Router } from "express";
import { makeCreateUserController } from "../factories";
import { adaptRoute } from "../adapters/express-route.adapter";

const userRouter = Router();

userRouter.get("/test", adaptRoute(makeCreateUserController()));

export { userRouter };

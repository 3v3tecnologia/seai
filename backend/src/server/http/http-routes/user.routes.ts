import { Router } from "express";
import { makeCreateUserController } from "../factories";
import { adaptRoute } from "../adapters/express-route.adapter";

const userRouter = Router();

userRouter.get("/test", (req, res) => adaptRoute(makeCreateUserController()));

export { userRouter };

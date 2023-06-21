import { Router } from "express";
import { CreateUserController } from "../../../adapters/controllers/user/create.controller";

const userRouter = Router();

userRouter.get("/test", (req, res) => createUserController.handle(req, res));

export { userRouter };

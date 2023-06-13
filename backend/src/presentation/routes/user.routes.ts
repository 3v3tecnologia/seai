import { Router } from "express";

import user from "../controllers/factories/user-controllers";

const userRoutes = Router();

userRoutes.get("/test", user.createUser.handle);

export { userRoutes };

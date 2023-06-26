import { Router } from "express";
import { makeCreateUserController } from "../factories";
import { adaptRoute } from "../adapters/express-route.adapter";

import { adminAuth, authorization } from "../http-middlewares";

export const userRouter = (router: Router): Router => {
  router.post("/register", adminAuth, adaptRoute(makeCreateUserController()));

  router.put(
    "/update/:id",
    authorization,
    adaptRoute(makeCreateUserController())
  );

  router.delete("/delete", adminAuth, adaptRoute(makeCreateUserController()));

  router.get("/get/:id", adminAuth, adaptRoute(makeCreateUserController()));

  router.get("/list", adminAuth, adaptRoute(makeCreateUserController()));

  return router;
};

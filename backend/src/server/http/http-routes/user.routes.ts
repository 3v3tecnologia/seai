import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";
import { makeCreateUserController } from "../factories";

import { adminAuth, authorization } from "../http-middlewares";

export const userRouter = (router: Router): Router => {
  // criar novo usuário
  router.post("/register", adminAuth, adaptRoute(makeCreateUserController()));
  
  // continuar o cadastro de usuário
  router.post("/register/new-user", adaptRoute(makeCreateUserController()));


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

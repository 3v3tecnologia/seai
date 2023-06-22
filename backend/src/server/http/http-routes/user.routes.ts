import { Router } from "express";
import { makeCreateUserController } from "../factories";
import { adaptRoute } from "../adapters/express-route.adapter";

export const userRouter = (router: Router): Router => {
  router.post("/register", adaptRoute(makeCreateUserController()));

  router.put("/update/:id", adaptRoute(makeCreateUserController()));

  router.delete("/delete", adaptRoute(makeCreateUserController()));

  router.get("/get/:id", adaptRoute(makeCreateUserController()));

  router.get("/list", adaptRoute(makeCreateUserController()));

  return router;
};

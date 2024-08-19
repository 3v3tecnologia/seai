import express from "express";
import { newsRouter } from "../../../domain/Newsletter/infra/http/newsletter.routes";
import { userRouter } from "../../../domain/User/Government/infra/http/user.routes";
import { userOperationsRouter } from "../../../domain/Logs/infra/http/user-operations.routes";
import { faqRouter } from "../../../domain/FAQ/infra/http/faq.routes";
import { setEquipmentsV1Router } from "../../../domain/Equipments/http/v1.routes";
import { irrigationUserRoutes } from "../../../domain/User/Irrigant/infra/http/irrigation-user.routes";

const v1Router = express.Router();

v1Router.use("/faq", faqRouter());

v1Router.use("/user", userRouter());
v1Router.use("/user/irrigant", irrigationUserRoutes());

setEquipmentsV1Router(v1Router);
v1Router.use("/news", newsRouter());
v1Router.use("/logs", userOperationsRouter());

export { v1Router };

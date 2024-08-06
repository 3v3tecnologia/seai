import express from "express";
import { equipmentsRouter } from "../http-routes";
import { newsRouter } from "../../../modules/Newsletter/infra/http/newsletter.routes";
import { userRouter } from "../../../modules/User/Government/infra/http/user.routes";
import { userOperationsRouter } from "../../../modules/Logs/infra/http/user-operations.routes";
import { faqRouter } from "../../../modules/FAQ/infra/http/faq.routes";

const v1Router = express.Router();

v1Router.use("/faq", faqRouter());

v1Router.use("/user", userRouter());
v1Router.use("/equipments", equipmentsRouter());
v1Router.use("/news", newsRouter());
v1Router.use("/logs", userOperationsRouter());

export { v1Router };

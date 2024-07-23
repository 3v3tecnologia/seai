import express from "express";
import { equipmentsRouter, faqRouter, userRouter } from "../http-routes";
import { newsRouter } from "../../../modules/Newsletter/infra/http/newsletter.routes";

const v1Router = express.Router();

v1Router.use("/faq", faqRouter);

v1Router.use("/user", userRouter());
v1Router.use("/equipments", equipmentsRouter());
v1Router.use("/news", newsRouter());

export { v1Router };

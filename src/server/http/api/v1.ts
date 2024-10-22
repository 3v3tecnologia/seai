import express from "express";
import { setEquipmentsV1Router } from "../../../domain/Equipments/infra/http/v1.routes";
import { faqRouter } from "../../../domain/FAQ/infra/http/faq.routes";
import { userOperationsRouter } from "../../../domain/Logs/infra/http/user-operations.routes";
import { newsRouter } from "../../../domain/Newsletter/infra/http/newsletter.routes";
import { setupGovUserRoutes } from "../../../domain/User/infra/http/gov-user.routes";
import { setupIrrigationUser } from "../../../domain/User/infra/http/irrigation-user.routes";

const v1Router = express.Router();

v1Router.use("/faq", faqRouter());

v1Router.use("/equipments", setEquipmentsV1Router());

v1Router.use("/user", setupGovUserRoutes());
v1Router.use("/user/irrigant", setupIrrigationUser());

v1Router.use("/news", newsRouter());
v1Router.use("/logs", userOperationsRouter());

export { v1Router };


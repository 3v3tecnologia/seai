import express from "express";
import { setEquipmentsV1Router } from "../../../domain/Equipments/http/v1.routes";
import { faqRouter } from "../../../domain/FAQ/infra/http/faq.routes";
import { newsRouter } from "../../../domain/Newsletter/infra/http/newsletter.routes";
import { setupAuthorizationRoute } from "../../../domain/User/infra/http/auth.routes";
import { setupGovUserRoutes } from "../../../domain/User/infra/http/gov-user.routes";
import { setupUserIrrigantSettingsV2Routes } from "../../../domain/User/infra/http/irrigation-settings.routes";
import { setupIrrigationUser } from "../../../domain/User/infra/http/irrigation-user.routes";
import { userOperationsRouter } from "../../../domain/Logs/infra/http/user-operations.routes";

const v1Router = express.Router();

v1Router.use("/faq", faqRouter());


setEquipmentsV1Router(v1Router);
setupUserIrrigantSettingsV2Routes(v1Router)
// setupGovUserRoutes(v1Router)

v1Router.use("/user", setupGovUserRoutes());
v1Router.use("/user", setupAuthorizationRoute());
v1Router.use("/user/irrigant", setupIrrigationUser());
v1Router.use("/news", newsRouter());
v1Router.use("/logs", userOperationsRouter());

export { v1Router };

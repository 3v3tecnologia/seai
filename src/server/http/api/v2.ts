import express from "express";
import { setupCensusV2Routes } from "../../../domain/Census/infra/http/v2.routes";
import { setupIrrigationRecommendationV2Routes } from "../../../domain/Irrigation/infra/http/irrigation-recommendation";
import { setupManagementCropV2Routes } from "../../../domain/Crop/infra/http/crop";
import { setupUserIrrigantSettingsV2Routes } from "../../../domain/User/infra/http/irrigation-settings.routes";
import { setupEquipmentsV2Routes } from "../../../domain/Equipments/infra/http/v2.routes";

const v2Router = express.Router();

setupEquipmentsV2Routes(v2Router);
setupCensusV2Routes(v2Router);
setupManagementCropV2Routes(v2Router);
setupIrrigationRecommendationV2Routes(v2Router);
v2Router.use("/management/user/settings", setupUserIrrigantSettingsV2Routes());

export { v2Router };

import express from "express";
import { setupCensusV2Routes } from "../../../modules/census/http/v2.routes";
import { setupEquipmentsV2Routes } from "../../../modules/equipments/http/v2.routes";
import { setupManagementCropV2Routes } from "../../../modules/management/http/crop";
import { setupIrrigationRecommendationV2Routes } from "../../../modules/management/http/irrigation-recommendation";
import { setupUserIrrigantSettingsV2Routes } from "../../../modules/irrigant/user/http/user-settings";

const v2Router = express.Router();

setupEquipmentsV2Routes(v2Router);
setupCensusV2Routes(v2Router);
setupManagementCropV2Routes(v2Router);
setupIrrigationRecommendationV2Routes(v2Router);
setupUserIrrigantSettingsV2Routes(v2Router);

export { v2Router };

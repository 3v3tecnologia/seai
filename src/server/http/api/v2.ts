import express from "express";
import { setupCensusV2Routes } from "../../../domain/Census/http/v2.routes";
import { setupEquipmentsV2Routes } from "../../../domain/Equipments/http/v2.routes";
import { setupManagementCropV2Routes } from "../../../domain/Management/http/crop";
import { setupIrrigationRecommendationV2Routes } from "../../../domain/Management/http/irrigation-recommendation";
import { setupUserIrrigantSettingsV2Routes } from "../../../domain/User/Irrigant/infra/http/user-settings.routes";

const v2Router = express.Router();

setupEquipmentsV2Routes(v2Router);
setupCensusV2Routes(v2Router);
setupManagementCropV2Routes(v2Router);
setupIrrigationRecommendationV2Routes(v2Router);
setupUserIrrigantSettingsV2Routes(v2Router);

export { v2Router };

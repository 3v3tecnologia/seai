import express from "express";
import { setupCensusV2Routes } from "../../../domain/Census/http/v2.routes";
import { setupEquipmentsV2Routes } from "../../../domain/Equipments/http/v2.routes";
import { setupIrrigationRecommendationV2Routes } from "../../../domain/Irrigation/http/irrigation-recommendation";
import { setupManagementCropV2Routes } from "../../../domain/Crop/http/crop";
import { setupUserIrrigantSettingsV2Routes } from "../../../domain/User/infra/http/irrigation-settings.routes";

const v2Router = express.Router();

setupEquipmentsV2Routes(v2Router);
setupCensusV2Routes(v2Router);
setupManagementCropV2Routes(v2Router);
setupIrrigationRecommendationV2Routes(v2Router);
setupUserIrrigantSettingsV2Routes(v2Router);

export { v2Router };

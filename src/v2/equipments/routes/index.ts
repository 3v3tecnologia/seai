import { Router } from "express";

import { setupEquipmentsRoutes } from "./equipments.routes";
import { setupEquipmentsMeasurementsRoutes } from "./measurements.routes";

export const equipmentsRoutes = (): Router => {
    const router = Router();

    setupEquipmentsRoutes(router);
    setupEquipmentsMeasurementsRoutes(router);

    return router;
};

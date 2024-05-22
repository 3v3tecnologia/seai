import express from 'express';
import { managementRoutes } from '../../../modules/management/v2/routes/routes';
import { equipmentsRoutes } from '../../../modules/equipments/v2/routes';

const v2Router = express.Router();

v2Router.use("/management", managementRoutes());
v2Router.use("/equipments", equipmentsRoutes());

export { v2Router }
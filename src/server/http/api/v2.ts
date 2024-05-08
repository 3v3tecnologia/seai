import express from 'express';
import { managementRoutes } from '../../../v2/management/routes/routes';
import { equipmentsRoutes } from '../../../v2/equipments/routes';

const v2Router = express.Router();

v2Router.use("/management", managementRoutes());
v2Router.use("/equipments", equipmentsRoutes());

export { v2Router }
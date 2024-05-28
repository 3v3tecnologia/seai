import express from 'express';
import { setupEquipmentsRoutes } from '../../../modules/equipments/http/v2.routes';

const v2Router = express.Router();

v2Router.use("/equipments", setupEquipmentsRoutes());

export { v2Router }
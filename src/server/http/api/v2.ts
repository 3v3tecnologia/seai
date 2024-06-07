import express from 'express';
import { setupEquipmentsV2Routes } from '../../../modules/equipments/http/v2.routes';
import { setupCensusV2Routes } from '../../../modules/census/http/v2.routes';
import { setupManagementV2Routes } from '../../../modules/management/http/v2.routes';

const v2Router = express.Router();

setupEquipmentsV2Routes(v2Router)
setupCensusV2Routes(v2Router)
setupManagementV2Routes(v2Router)

export { v2Router }
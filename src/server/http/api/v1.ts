import express from 'express';
import { accessKeyRouter, backgroundJobsRouter, censusRouter, equipmentsRouter, faqRouter, newsRouter, userRouter } from '../http-routes';
import { setupManagementRoutes } from '../../../modules/management/http/v1.routes';

const v1Router = express.Router();

v1Router.use('/faq', faqRouter);

v1Router.use("/user", userRouter());
v1Router.use("/census", censusRouter());
v1Router.use("/equipments", equipmentsRouter());
v1Router.use("/news", newsRouter());
v1Router.use("/jobs", backgroundJobsRouter());
v1Router.use("/accessKey", accessKeyRouter());
v1Router.use("/management", setupManagementRoutes());


export { v1Router };

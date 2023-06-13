import express from "express";

import { setRoutes } from "./routes";

import { setMiddleware } from "./midlewares";

const app = express();

setMiddleware(app);
setRoutes(app);

export { app };

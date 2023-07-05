import express, { Express } from "express";

import { setRoutes } from "./routes";

import { setMiddleware } from "./middlewares";
import { setApiDocs } from "./swagger-docs";

export const setupApp = async (): Promise<Express> => {
  const app = express();

  setApiDocs(app);
  setMiddleware(app);
  setRoutes(app);

  return app;
};

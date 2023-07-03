import express, { Express } from "express";

import { setRoutes } from "./routes";

import { setMiddleware } from "./middlewares";
import { setApiDocs } from "./swagger";

export const setupApp = async (): Promise<Express> => {
  const app = express();

  setMiddleware(app);
  setRoutes(app);
  setApiDocs(app);

  return app;
};

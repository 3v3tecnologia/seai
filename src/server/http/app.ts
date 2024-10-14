import express, { Express } from "express";
import { resolve } from "node:path";

import { setRoutes } from "./routes";

import { setMiddleware } from "./middlewares";
import { setApiDocs } from "./swagger-docs";

import morgan from "morgan";

export const setupApp = async (): Promise<Express> => {
  const app = express();

  app.use(morgan("tiny"));

  app.use(express.json({ limit: `2mb` }));
  app.use(express.urlencoded({ extended: true }));

  setApiDocs(app);
  setMiddleware(app);
  setRoutes(app);

  return app;
};

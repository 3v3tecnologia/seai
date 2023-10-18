import express, { Express } from "express";

import { setRoutes } from "./routes";

import { setMiddleware } from "./middlewares";
import { setApiDocs } from "./swagger-docs";

// import morgan from "morgan"
// import helmet from 'helmet'

export const setupApp = async (): Promise<Express> => {
  const app = express();

  // app.use(helmet())
  // app.use(morgan('tiny'))

  setApiDocs(app);
  setMiddleware(app);
  setRoutes(app);

  return app;
};

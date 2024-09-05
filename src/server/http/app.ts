import express, { Express } from "express";
import { resolve } from "node:path";

import { setRoutes } from "./routes";

import { setMiddleware } from "./middlewares";
import { setApiDocs } from "./swagger-docs";

import morgan from "morgan";

export const setupApp = async (): Promise<Express> => {
  const app = express();

  app.use(morgan("tiny"));

  app.use(express.json({ limit: `1mb` }));
  app.use(express.urlencoded({ limit: `1mb`, extended: true }));

  app.use(
    "/static",
    express.static(resolve(__dirname, "..", "..", "..", "public"))
  );

  app.get("/", (request, response) => {
    return response.sendFile(
      resolve(__dirname, "..", "..", "..", "public", "index.html")
    );
  });

  setApiDocs(app);
  setMiddleware(app);
  setRoutes(app);

  return app;
};

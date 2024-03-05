import express, { Express } from "express";
import { resolve } from "node:path";

import { setRoutes } from "./routes";

import { setMiddleware } from "./middlewares";
import { setApiDocs } from "./swagger-docs";

import morgan from "morgan";
import helmet from "helmet";

export const setupApp = async (): Promise<Express> => {
  const app = express();

  // app.use(
  //   helmet.contentSecurityPolicy({
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       fontSrc: ["'self'"],
  //       imgSrc: ["'self'"],
  //       scriptSrc: ["'self'"],
  //       styleSrc: ["'self'"],
  //       frameSrc: ["'self'"],
  //     },
  //     reportOnly: true, // Set to 'true' to enable report-only mode
  //   })
  // );
  app.use(morgan("tiny"));

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

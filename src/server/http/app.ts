import express, { Express } from "express";
import { resolve } from "node:path";

import { setRoutes } from "./routes";

import { setMiddleware } from "./middlewares";
import { setApiDocs } from "./swagger-docs";

import morgan from "morgan";
import helmet from "helmet";
import { MAX_PAYLOAD_SIZE } from "./config/payload";

export const setupApp = async (): Promise<Express> => {
  const app = express();

  // app.use(helmet({
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
  //       styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
  //       imgSrc: ["'self'", 'data:', 'online.swagger.io'],
  //     },
  //   },
  //   hidePoweredBy: true, // This hides the X-Powered-By header
  // }));

  app.use(morgan("tiny"));

  app.use(express.json({ limit: `${MAX_PAYLOAD_SIZE}mb` }));
  app.use(express.urlencoded({ limit: `${MAX_PAYLOAD_SIZE}mb`, extended: true }));

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

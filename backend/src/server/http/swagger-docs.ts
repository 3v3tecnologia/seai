import { Express } from "express";

import swaggerUi from "swagger-ui-express";

import swaggerFile from "./swagger.json";

export function setApiDocs(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
}

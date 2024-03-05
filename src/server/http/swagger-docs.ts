import { Express } from "express";

import swaggerUi from "swagger-ui-express";

import ApiDocs from "./docs/api/http/swagger";

export function setApiDocs(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(ApiDocs));
}

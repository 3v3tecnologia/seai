import { Express } from "express";

import { bodyParser } from "./http-middlewares/body-parser";
import { contentType } from "./http-middlewares/content-type";
import { cors } from "./http-middlewares/cors";

export function setMiddleware(app: Express): void {
  app.use(bodyParser);
  app.use(contentType);
  app.use(cors);
}

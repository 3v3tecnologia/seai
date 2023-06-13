import { Express } from "express";

import { bodyParser, contentType, cors } from "../midlewares";

export function setMiddleware(app: Express): void {
  app.use(bodyParser);
  app.use(contentType);
  app.use(cors);
}

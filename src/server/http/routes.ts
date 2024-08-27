import { Express } from "express";

import { v1Router } from "./api/v1";
import { v2Router } from "./api/v2";

export function setRoutes(app: Express): void {
  app.get("/_health", (req, res) => {
    res.status(200).json({ status: "good" });
  });

  app.use("/api/v1", v1Router);
  app.use("/api/v2", v2Router);

  app.use("*", (req, res) => {
    res.status(404).json({
      error: ":[ Ops ! recurso não encontrado, verifique a URL informada.",
    });
  });
}

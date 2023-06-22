import { Router } from "express";
import { adaptRoute } from "../adapters/express-route.adapter";

export const loginRouter = (router: Router): Router => {
  router.post("/sign-up", (req, res) =>
    res.status(200).json({ message: "signup" })
  );
  router.post("/sign-in", (req, res) =>
    res.status(200).json({ message: "sigin" })
  );
  return router;
};

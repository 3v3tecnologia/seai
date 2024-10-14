import { Router } from "express";
import { adaptHTTPHandler, adaptRoute } from "../../../../server/http/adapters/express-route.adapter";

import {
  authorization,
  FAQPermissions,
} from "../../../../server/http/http-middlewares";
import { FAQController } from "../../controllers/faq.controller";

export const faqRouter = (): Router => {
  const router = Router();

  router.get(
    "/categories",
    // authorization,
    adaptHTTPHandler(FAQController.getCategories),
  );

  router.put(
    "/categories/:id",
    authorization,
    FAQPermissions.write,
    adaptHTTPHandler(FAQController.updateCategory)
  );

  router.post(
    "/categories",
    authorization,
    FAQPermissions.write,
    adaptHTTPHandler(FAQController.createCategory)
  );

  router.delete(
    "/categories/:id",
    authorization,
    FAQPermissions.read,
    adaptHTTPHandler(FAQController.deleteCategory)
  );

  router.get(
    "/",
    // authorization,
    adaptHTTPHandler(FAQController.getFaqs)
  );

  router.get(
    "/:id",
    // authorization,
    adaptHTTPHandler(FAQController.getFaqById),
  );

  router.post(
    "/",
    authorization,
    FAQPermissions.write,
    adaptHTTPHandler(FAQController.createFaq),
  );

  router.put(
    "/:id",
    authorization,
    FAQPermissions.write,
    adaptHTTPHandler(FAQController.updateFaq),
  );

  router.delete(
    "/:id",
    authorization,
    FAQPermissions.write,
    adaptHTTPHandler(FAQController.deleteFaq),
  );

  return router;
};

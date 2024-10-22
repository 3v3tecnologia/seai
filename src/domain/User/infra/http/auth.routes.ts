import { Request, Response, Router } from "express";
import { AuthenticationController } from "../../controllers/auth.controller";


export const setupAuthenticationRoutes = (): Router => {
  const router = Router();

  router.post(
    "/",
    async (request: Request, response: Response) => {
      const req = {
        ...(request.body || {}),
        ...(request.params || {}),
      };

      const fullUrl = `${request.protocol}://${request.get('host')}${request.originalUrl}`;


      const res = await AuthenticationController.signIn(req, fullUrl);

      if (res.statusCode >= 200 && res.statusCode < 300) {
        return response.status(res.statusCode).json({
          data: res.body,
        });
      }

      return response.status(res.statusCode).json({
        error: res.body.message,
      });
    });
  return router
};

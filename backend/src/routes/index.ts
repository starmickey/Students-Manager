import { NextFunction, Request, Response, Router } from "express";
import { getLogger } from "../config/logger";
import { getControlRoutes } from "./controlRoutes";
import { getLanguageRoutes, getTranslateRoutes } from "./translateRoutes";
import { getSecurityRoutes } from "./securityRoutes";

/**
 * Main Routes Setup
 * 
 * Configures and returns the primary Express Router with all application routes.
 * 
 * Features:
 *  - Logs every incoming API request with method, URL, headers, body, and client IP.
 *  - Mounts authentication, control, translation, and language routes under their respective paths.
 *  - Handles unmatched routes by returning a 404 "Page not found" response.
 * 
 * Routes mounted:
 *  - /auth       -> Security and authentication routes
 *  - /control    -> Server health and control routes
 *  - /translate  -> Translation-related routes
 *  - /languages  -> Language management routes
 * 
 * @returns {Router} Configured Express Router instance
 */
export function getRoutes() {
  const router = Router();
  const logger = getLogger();

  // Log every API call with details
  router.use("/", (req: Request, res: Response, next: NextFunction) => {
    const { method, url, headers, body, ip } = req;
    
    logger.http(`${method} ${url} - IP: ${ip}`);
    logger.debug(`Headers: ${JSON.stringify(headers)}`);
    logger.debug(`Body: ${JSON.stringify(body)}`);

    next();
  });

  // Mount the individual route modules
  router.use("/auth", getSecurityRoutes());
  router.use("/control", getControlRoutes());
  router.use("/translate", getTranslateRoutes());
  router.use("/languages", getLanguageRoutes());

  // Handle unmatched routes with 404
  router.use("/", (req: Request, res: Response) => {
    res.status(404).send("Page not found");
  });

  return router;
}

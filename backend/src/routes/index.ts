import { NextFunction, Request, Response, Router } from "express";
import logger from "../config/logger";
import { getControlRoutes } from "./controlRoutes";
import { getLanguageRoutes, getTranslateRoutes } from "./translateRoutes";
import { getSecurityRoutes } from "./securityRoutes";
import { getCoursesRoutes, getSubjectRoutes } from "./coursesRoutes";

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

  // Log every API call with details
  router.use("/", (req: Request, _, next: NextFunction) => {
    const { method, url, headers, body, ip } = req;
    
    logger.http(`${method} ${url} - IP: ${ip}`);
    logger.debug(`Headers: ${JSON.stringify(headers)}`);
    logger.debug(`Body: ${JSON.stringify(body)}`);

    next();
  });

  // Mount the individual route modules
  router.use("/auth", getSecurityRoutes());
  router.use("/control", getControlRoutes());
  router.use("/courses", getCoursesRoutes());
  router.use("/languages", getLanguageRoutes());
  router.use("/subjects", getSubjectRoutes());
  router.use("/translate", getTranslateRoutes());

  // Handle unmatched routes with 404
  router.use("/", (_, res: Response) => {
    res.status(404).send("Page not found");
  });

  return router;
}

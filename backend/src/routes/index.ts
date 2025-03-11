import { NextFunction, Request, Response, Router } from "express";
import { getLogger } from "../config/logger";
import { getControlRoutes } from "./controlRoutes";
import { getTranslateRoutes } from "./translateRoutes";

export function getRoutes() {
  const router = Router();
  const logger = getLogger();

  // Log every API call
  router.use("/", (req: Request, res: Response, next: NextFunction) => {
    const { method, url, headers, body, ip } = req;
    
    logger.http(`${method} ${url} - IP: ${ip}`);
    logger.debug(`Headers: ${JSON.stringify(headers)}`);
    logger.debug(`Body: ${JSON.stringify(body)}`);

    next();
  });

  // Set up main calls
  router.use("/control", getControlRoutes());
  router.use("/translate", getTranslateRoutes());

  // Set Not Found error response
  router.use("/", (req: Request, res: Response) => {
    res.status(404).send("Page not found");
  });

  return router;
}
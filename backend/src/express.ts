import express from "express";
import { getLogger } from "./config/logger";
import bodyParser from "body-parser";
import { getRoutes } from "./routes";

/**
 * Starts an Express application
 * 
 * @param port the port where the app will run.
 */
export function initExpress(port: number) {
  const app = express();
  const logger = getLogger();

  // parse application/json body
  app.use(bodyParser.json());

  app.use(getRoutes());

  app.listen(port, () => {
    logger.info(`Server running on port ${port}.`)
  });
}
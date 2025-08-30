import mongoose from "mongoose";
import { initEnv, MONGO_URI, NODE_ENV } from "./config/env";
import { initExpress } from "./express";
import logger from "./config/logger";

/**
 * Application entry point.
 *
 * Loads configuration, initializes the Express server,
 * and establishes connection to MongoDB using Mongoose.
 */

// Load environment configuration variables
initEnv();

logger.info(`Starting server in ${NODE_ENV} mode...`)

// Initialize and start Express server
initExpress();

mongoose.connect(MONGO_URI).then(() => {
  logger.info("Mongoose connection established");
});

import mongoose from "mongoose";
import { getEnvironment } from "./config/env";
import { initLogger } from "./config/logger";
import { initExpress } from "./express";

/**
 * Application entry point.
 *
 * Loads configuration, initializes logger and Express server,
 * and establishes connection to MongoDB using Mongoose.
 */

// Load environment configuration variables
const conf = getEnvironment();

// Initialize application logger based on current environment
const logger = initLogger(conf.nodeEnv);

// Initialize and start Express server
initExpress(conf);

// Connect to MongoDB using Mongoose
mongoose.connect(conf.mongoUri).then(() => {
  logger.info("Mongoose connection established");
});

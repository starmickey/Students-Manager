import mongoose from "mongoose";
import { getEnvironment } from "./config/env";
import { initLogger } from "./config/logger";
import { initExpress } from "./express";

const { nodeEnv, port, mongoUri } = getEnvironment();

const logger = initLogger(nodeEnv);

initExpress(port);

mongoose.connect(mongoUri).then(() => {
  logger.info("Mongoose connection stablished");
});

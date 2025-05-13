import mongoose from "mongoose";
import { getEnvironment } from "./config/env";
import { initLogger } from "./config/logger";
import { initExpress } from "./express";

const conf = getEnvironment();

const logger = initLogger(conf.nodeEnv);

initExpress(conf);

mongoose.connect(conf.mongoUri).then(() => {
  logger.info("Mongoose connection stablished");
});

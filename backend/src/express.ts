import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import {getLogger} from './config/logger';
import {getRoutes} from './routes';
import {PassportMiddleware} from './middleware/passport';
import {Environment} from './config/env';

/**
 * Starts an Express application
 *
 * @param port the port where the app will run.
 */
export function initExpress({googleCredentials, port}: Environment) {
  const app = express();
  const logger = getLogger();

  
  // Enable cors policy
  app.use(cors());
  
  // Enable authentication
  PassportMiddleware.init({googleCredentials});

  // parse application/json body
  app.use(bodyParser.json());

  app.use(getRoutes());

  app.listen(port, () => {
    logger.info(`Server running on port ${port}.`);
  });
}

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import logger from './config/logger';
import {getRoutes} from './routes';
import {PassportMiddleware} from './middleware/passport';
import {
  Environment,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  PORT,
} from './config/env';

/**
 * Initializes and starts an Express application server.
 *
 * This function sets up middleware for CORS, body parsing, and authentication,
 * mounts the application routes, and begins listening on the specified port.
 *
 * @param {Environment} params - Configuration parameters
 * @param {object} params.googleCredentials - OAuth credentials required for Google authentication
 * @param {string} params.googleCredentials.clientID - Google OAuth client ID
 * @param {string} params.googleCredentials.clientSecret - Google OAuth client secret
 * @param {number} params.port - Port number on which the Express server will listen
 *
 * @returns {void}
 */
export function initExpress(): void {
  const app = express();

  // Enable CORS for cross-origin requests
  app.use(cors());

  // Initialize Google OAuth authentication middleware
  PassportMiddleware.init({
    googleCredentials: {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  });

  // Enable JSON body parsing for incoming requests
  app.use(bodyParser.json());

  // Mount all application routes
  app.use(getRoutes());

  // Start the server listening on the specified port
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}.`);
  });
}

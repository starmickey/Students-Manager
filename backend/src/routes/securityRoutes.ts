import {Router} from 'express';
import {getLogger} from '../config/logger';
import jwt from 'jsonwebtoken';
import {getEnvironment} from '../config/env';
import {PassportMiddleware} from '../middleware/passport';

/**
 * getSecurityRoutes
 *
 * Defines routes for user authentication and authorization using Google OAuth.
 *
 * Routes:
 *  - GET /google
 *      Initiates Google OAuth 2.0 authentication via Passport.
 *      Redirects user to Google login page.
 *
 *  - GET /google/redirect
 *      Callback route that Google redirects to after user authentication.
 *      Handles authentication response, issues JWT token, and redirects or responds with user data.
 *
 * Behavior:
 *  - On authentication error, logs error and either redirects with error param or sends 500 JSON error.
 *  - If no user found, redirects or responds with 401 error.
 *  - On success, issues JWT token signed with secret from environment and redirects or responds with token and user info.
 *
 * Environment Variables Used:
 *  - jswSecret: Secret key for signing JWT tokens.
 *  - loginRedirectPath: Optional client URL to redirect after authentication (with token or error).
 *
 * @returns {Router} Express router with security routes configured.
 */
export function getSecurityRoutes() {
  const router = Router();

  // Route to initiate Google OAuth login
  router.get('/google', PassportMiddleware.authenticate());

  // OAuth callback route
  router.get('/google/redirect', (req, res, next) => {
    const logger = getLogger();
    const {jswSecret, loginRedirectPath} = getEnvironment();

    PassportMiddleware.checkAuthenticationStatus((err, user, info) => {
      // Handle errors during authentication
      if (err) {
        logger.error('Authentication error:', err);
        if (loginRedirectPath) {
          return res.redirect(`${loginRedirectPath}?error=UnexpectedError`);
        } else {
          return res.status(500).json({error: 'Authentication failed', details: err.message});
        }
      }

      // Handle case where user is not found
      if (!user) {
        if (loginRedirectPath) {
          return res.redirect(`${loginRedirectPath}?error=NoUserFound`);
        } else {
          return res.status(401).json({error: 'No user found', info});
        }
      }

      // Successful authentication: sign JWT and respond or redirect
      const token = jwt.sign({id: user.id}, jswSecret);

      if (loginRedirectPath) {
        return res.redirect(`${loginRedirectPath}?token=${token}`);
      } else {
        return res.json({user, token});
      }
    })(req, res, next);
  });

  return router;
}

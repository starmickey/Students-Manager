import {Router} from 'express';
import {getLogger} from '../config/logger';
import jwt from 'jsonwebtoken';
import {getEnvironment} from '../config/env';
import {PassportMiddleware} from '../middleware/passport';

/**
 * Routes used for authentication and authorization
 *
 * @returns an Express Router
 */
export function getSecurityRoutes() {
  const router = Router();

  router.get('/google', PassportMiddleware.authenticate());

  router.get('/google/redirect', (req, res, next) => {
    const logger = getLogger();
    const {jswSecret, loginRedirectPath} = getEnvironment();

    PassportMiddleware.checkAuthenticationStatus((err, user, info) => {
      // Handle error
      if (err) {
        logger.error('Authentication error:', err);
        if (loginRedirectPath) {
          return res.redirect(`${loginRedirectPath}?error=UnexpectedError`);
        } else {
          return res
            .status(500)
            .json({error: 'Authentication failed', details: err.message});
        }
      }

      // Handler user not found
      if (!user) {
        if (loginRedirectPath) {
          return res.redirect(`${loginRedirectPath}?error=NoUserFound`);
        } else {
          return res.status(401).json({error: 'No user found', info});
        }
      }

      // Successfull path
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

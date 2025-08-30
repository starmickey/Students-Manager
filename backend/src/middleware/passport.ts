/**
 * PassportMiddleware
 *
 * This class encapsulates the setup and usage of Passport.js for Google OAuth 2.0 authentication.
 * It follows a singleton pattern to prevent multiple initializations.
 *
 * Usage:
 * 1. Initialize with credentials:
 *    PassportMiddleware.init({ googleCredentials: { clientID, clientSecret } });
 *
 * 2. Use middleware in Express routes:
 *    app.get('/auth/google', PassportMiddleware.authenticate());
 *    app.get('/auth/google/redirect', PassportMiddleware.checkAuthenticationStatus(callback));
 *
 * Responsibilities:
 * - Configures Google OAuth strategy
 * - Manages Passport initialization and instance control
 * - Provides utility methods for authentication and status checking
 */

import passport, {PassportStatic, Profile} from 'passport';
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import {User} from '../models/securityModels';
import {findOrCreateByGoogleIdUser} from '../repository/securityRepository';
import logger from '../config/logger';

export interface GoogleCredentials {
  clientID: string;
  clientSecret: string;
}

interface Credentials {
  googleCredentials: GoogleCredentials;
}

export class PassportMiddleware {
  static instance: PassportMiddleware;
  passport: PassportStatic;

  /**
   * Private constructor — use init() to instantiate.
   */
  private constructor({googleCredentials}: Credentials) {
    this.passport = passport;
    this.setGoogleOAuth20(googleCredentials);
  }

  /**
   * Initializes the PassportMiddleware singleton with Google credentials.
   * Must be called once before using the middleware.
   *
   * @param credentials Object containing Google client ID and secret
   * @throws Error if already initialized
   */
  static init(credentials: Credentials) {
    if (PassportMiddleware.instance) {
      throw Error("Passport can't be initialized twice.");
    }

    logger.debug('Setting passport...');
    PassportMiddleware.instance = new PassportMiddleware(credentials);
  }

  /**
   * Returns the initialized instance of PassportMiddleware.
   *
   * @returns PassportMiddleware
   * @throws Error if init() has not been called
   */
  static getInstance() {
    const instance = PassportMiddleware.instance;

    if (!instance) {
      throw new Error(
        "Passport hasn't been initialized. You must run PassportMiddleware.init() to fix this",
      );
    }

    return instance;
  }

  /**
   * Express middleware for initiating Google OAuth 2.0 authentication flow.
   *
   * @returns Middleware that redirects to Google's OAuth consent screen
   */
  static authenticate() {
    const passport = PassportMiddleware.getInstance().passport;

    logger.debug('Authenticating...');
    return passport.authenticate('google', {scope: ['profile', 'email']});
  }

  /**
   * Express middleware for handling the OAuth callback (on redirect).
   *
   * @param callback Optional callback function for custom response handling
   * @returns Middleware that verifies the Google OAuth response
   */
  static checkAuthenticationStatus(callback?: (...args: any[]) => any) {
    const passport = PassportMiddleware.getInstance().passport;
    return passport.authenticate('google', {session: false}, callback);
  }

  /**
   * Sets up the Google OAuth 2.0 strategy.
   *
   * @param googleCredentials Object with Google OAuth clientID and clientSecret
   */
  private setGoogleOAuth20({clientID, clientSecret}: GoogleCredentials) {
    logger.debug('Setting up Google OAuth authentication...');

    this.passport.use(
      new GoogleStrategy(
        {
          clientID,
          clientSecret,
          callbackURL: '/auth/google/redirect',
        },
        async function (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          cb: VerifyCallback,
        ) {
          try {
            const user = await findOrCreateByGoogleIdUser({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value,
            });

            return cb(null, user);
          } catch (err) {
            return cb(err);
          }
        },
      ),
    );

    logger.debug('Google OAuth authentication set');

    // Serialize the user ID to session
    this.passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    // Deserialize the user ID back into a user object
    this.passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err);
      }
    });
  }
}

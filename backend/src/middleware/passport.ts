import passport, {PassportStatic, Profile} from 'passport';
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import {User} from '../models/securityModels';
import {findOrCreateByGoogleIdUser} from '../repository/securityRepository';
import {getLogger} from '../config/logger';

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

  private constructor({googleCredentials}: Credentials) {
    this.passport = passport;
    this.setGoogleOAuth20(googleCredentials);
  }

  static init(credentials: Credentials) {
    const logger = getLogger();

    if (PassportMiddleware.instance) {
      throw Error("Passport can't be initialized twice.");
    }

    logger.debug('Setting passport...');
    PassportMiddleware.instance = new PassportMiddleware(credentials);
  }

  static getInstance() {
    let instance = PassportMiddleware.instance;

    if (!instance) {
      throw new Error(
        "Passport hasn't been initialized. You must run PassportMiddleware.init() to fix this",
      );
    }

    return instance;
  }

  static authenticate() {
    const logger = getLogger();
    const passport = PassportMiddleware.getInstance().passport;
    
    logger.debug('Authenticating...');
    return passport.authenticate('google', {scope: ['profile', 'email']});
  }

  static checkAuthenticationStatus(callback?: (...args: any[]) => any) {
    const passport = PassportMiddleware.getInstance().passport;
    return passport.authenticate('google', {session: false}, callback);
  }

  private setGoogleOAuth20({clientID, clientSecret}: GoogleCredentials) {
    const logger = getLogger();
    logger.debug("Setting up Google OAuth authentication");
    
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
            let user = await findOrCreateByGoogleIdUser({
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

    logger.debug("Google OAuth authentication set");

    this.passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

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

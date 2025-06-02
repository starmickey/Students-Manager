import { getLogger } from '../config/logger';
import { IUser, User } from '../models/securityModels';

interface findOrCreateByGoogleIdUserProps {
  name: string;
  email: string | undefined;
  googleId: string;
}

/**
 * findOrCreateByGoogleIdUser
 * 
 * This function attempts to find an existing user in the database by their Google ID.
 * If no user is found, it creates a new user record with the provided details.
 * 
 * @param userDTO - Object containing the user's Google ID, name, and optional email.
 *   - googleId: (string) Unique identifier from Google OAuth
 *   - name: (string) User's full name
 *   - email: (string | undefined) User's email address, optional
 * 
 * @returns Promise<IUser> - Resolves to the found or newly created user document
 * 
 * @example
 * ```ts
 * const user = await findOrCreateByGoogleIdUser({
 *   googleId: '1234567890',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 * });
 * ```
 */
export async function findOrCreateByGoogleIdUser(
  userDTO: findOrCreateByGoogleIdUserProps,
): Promise<IUser> {
  const logger = getLogger();

  // Try to find a user by googleId
  let user = await User.findOne({ googleId: userDTO.googleId });

  logger.debug(`Results of fetching user: ${user}`);

  // If no user exists, create and save a new user
  if (!user) {
    user = new User(userDTO);
    await user.save();
    logger.verbose(`New user created: ${user}`);
  }

  return user as IUser;
}

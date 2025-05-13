import {getLogger} from '../config/logger';
import {IUser, User} from '../models/securityModels';

interface findOrCreateByGoogleIdUserProps {
  name: string;
  email: string | undefined;
  googleId: string;
}

export async function findOrCreateByGoogleIdUser(
  userDTO: findOrCreateByGoogleIdUserProps,
) {
  const logger = getLogger();

  let user = await User.findOne({googleId: userDTO.googleId});

  logger.debug(`Results of fetching user: ${user}`);

  if (!user) {
    user = new User(userDTO);
    await user.save();
    logger.verbose(`New user created: ${user}`);
  }

  return user as IUser;
}

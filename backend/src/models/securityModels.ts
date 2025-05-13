import {model, Model, Schema, Document} from 'mongoose';

/**
 * USER
 *
 * Attributes:
 *    - name: User name
 *    - email: User email
 *    - googleId: Google's Account unique identifier
 */
interface IUser extends Document {
  name: string;
  email: string;
  googleId: string | undefined;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
    unique: true,
  },
});

const User: Model<IUser> = model<IUser>('User', userSchema);

export {
  IUser,
  User,
};

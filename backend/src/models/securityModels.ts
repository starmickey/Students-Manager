import { model, Model, Schema, Document } from 'mongoose';

/**
 * USER MODEL
 *
 * Represents an authenticated user in the system.
 * Typically used for access control, session tracking, and user-specific data.
 *
 * Fields:
 * - name: (string) Required. The user's display name.
 * - email: (string) Optional. The user's email address.
 * - googleId: (string | undefined) Optional. Unique identifier linked to a Google account, used for Google OAuth login.
 *
 * Notes:
 * - googleId is marked as `unique` to prevent multiple users being created with the same Google account.
 * - email is marked as `unique` to prevent multiple users being created with the same Google account.
 */
interface IUser extends Document {
  name: string;
  email: string;
  googleId: string | undefined;
}

// Mongoose schema definition for the User model
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true, // Every user must have a name
  },
  email: {
    type: String,
    required: false, // Optional email field
    unique: true,    // Must be unique if provided
  },
  googleId: {
    type: String,
    required: false, // Optional Google OAuth ID
    unique: true,    // Must be unique if provided
  },
});

// User model exported for use in authentication, session tracking, and database access
const User: Model<IUser> = model<IUser>('User', userSchema);

export {
  IUser,
  User,
};

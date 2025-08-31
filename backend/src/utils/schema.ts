import {z} from 'zod';
import {Types} from 'mongoose';

// Zod schema for a valid ObjectId string
export const getObjectIdSchema = ({required_error}: {required_error: string}) =>
  z
    .string({required_error})
    .refine(val => Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId',
    })
    .transform(val => new Types.ObjectId(val));

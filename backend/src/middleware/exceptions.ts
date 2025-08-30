import {Request, Response, NextFunction} from 'express';
import {ZodError} from 'zod';
import {APIError} from '../config/exceptions';

/**
 * Wraps a route/controller function with error handling.
 * Works with sync or async functions.
 */
export function useExceptionsMiddleware(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(err => handleError(err, res));
  };
}

function handleError(error: any, res: Response) {
  if (error instanceof ZodError) {
    const message = error.errors.map(e => e.message).join('. ');
    return res.status(400).json({message});
  }

  if (error instanceof APIError) {
    return res.status(error.status).json({message: error.message});
  }

  console.error('Unexpected error:', error);
  return res.status(500).json({message: error?.message || 'Unexpected error'});
}

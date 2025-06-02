import { Response } from "express";
import { ZodError } from "zod";
import { APIError, ConfigError } from "../config/exceptions";

/**
 * Handles exceptions thrown in controllers and sends appropriate HTTP responses.
 *
 * This function inspects the error type (e.g. Zod validation error, MongoDB error)
 * and formats a consistent error response to the client.
 * 
 * It supports:
 *  - Zod validation errors (422 Unprocessable Entity)
 *  - MongoDB validation errors (400 Bad Request)
 *  - Custom errors with a statusCode and message
 *  - Fallback to 500 Internal Server Error for unexpected issues
 *
 * @param res - Express response object
 * @param error - The error object caught in a try/catch block
 *
 * @example
 * try {
 *   // some controller logic
 * } catch (error) {
 *   handleExceptionResponse(res, error);
 * }
 */
const statuses = [
  { type: ZodError, status: 400 },
]

export function handleExceptionResponse(res: Response, error: any) {
  if (error instanceof ConfigError) {
    throw error;
  }

  const message =
    error instanceof ZodError ? parseZodError(error)
      : error.message || "Se produjo un error inesperado";

  const status =
    error instanceof APIError ? error.status
      : statuses.find(s => error instanceof s.type)?.status || 500;

  res.status(status).send({ message });
}

function parseZodError(error: ZodError) {
  return error.errors.map(e => e.message).join(". ");
}
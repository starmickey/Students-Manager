/**
 * ConfigError
 *
 * Thrown when a misconfiguration is detected during the initial setup of the application.
 * This is typically related to missing or invalid environment variables, or essential config values.
 *
 * Example use case:
 *   if (!process.env.API_KEY) throw new ConfigError("Missing API_KEY");
 */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/**
 * APIError
 *
 * Base class for HTTP-related errors. Contains a `status` code in addition to a message.
 * This class can be extended to represent specific HTTP error types (e.g., 400, 404, 500).
 *
 * Properties:
 * - status: HTTP status code to return in the response
 * - message: Human-readable error message
 *
 * Example use case:
 *   throw new APIError(404, "Resource not found");
 */
export class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

/**
 * BadRequest
 *
 * Specialized version of APIError for HTTP 400 Bad Request errors.
 * Indicates that the client sent invalid or malformed data.
 *
 * Example use case:
 *   throw new BadRequest("Missing required fields in the request body");
 */
export class BadRequest extends APIError {
  constructor(message: string) {
    super(400, message);
    this.name = 'BadRequest';
  }
}

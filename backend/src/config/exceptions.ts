/**
 * Error associated to mistakes occured during the initial
 * setup of the project, such as missing environment variables.
 */
export class ConfigError extends Error {
  constructor (message: string) {
    super(message);
  }
}

export class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class BadRequest extends APIError {
  constructor(message: string) {
    super(400, message);
  }
}
/**
 * Error associated to mistakes occured during the initial
 * setup of the project, such as missing environment variables.
 */
export class ConfigError extends Error {
  constructor (message: string) {
    super(message);
  }
}
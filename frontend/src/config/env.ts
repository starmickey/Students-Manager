/**
 * Singleton class responsible for loading and managing environment variables.
 * Ensures that required variables are properly set and accessible.
 */
export class Environment {
  static instance: Environment;
  serverURI: string;

  private constructor() {
    validateEnvironment(process.env);

    this.serverURI = process.env.SERVER_URI || "";
  }

  /**
   * Returns the singleton instance of the Environment class.
   * If no instance exists, it initializes one.
   *
   * @returns {Environment} - The singleton instance of the Environment class.
   */
  static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }

    return Environment.instance;
  }
}

/**
 * Provides a convenient function to retrieve the environment instance.
 *
 * @returns {Environment} - The singleton instance of the Environment class.
 */
export const getEnvironment = (): Environment => Environment.getInstance();

/**
 * Enum containing descriptive error messages for missing or invalid environment variables.
 */
enum ValidationErrors {
  MISSING_SERVER_URI = "Environment variable 'SERVER_URI' is missing. Please set it to the path to your server in your .env file",
}

function validateEnvironment(env: any) {
  if (!env.SERVER_URI || !env.SERVER_URI.trim()) {
    throw new Error(ValidationErrors.MISSING_SERVER_URI);
  }
}

export function getSignInPath() {
  return process.env.NEXT_PUBLIC_AUTH_PATH || "";
}

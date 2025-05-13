import "dotenv/config";
import { ConfigError } from "./exceptions";
import { GoogleCredentials } from "../middleware/passport";

/**
 * Defines the possible values for the application's environment mode.
 */
export enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

/**
 * Singleton class responsible for loading and managing environment variables.
 * Ensures that required variables are properly set and accessible.
 */
export class Environment {
  static instance: Environment;
  nodeEnv: NodeEnv;
  port: number;
  mongoUri: string;
  googleCredentials: GoogleCredentials;
  jswSecret: string;
  loginRedirectPath: string | undefined;

  private constructor() {
    validateEnvironment(process.env);

    this.nodeEnv = process.env.NODE_ENV as NodeEnv;
    this.port = Number(process.env.PORT);
    this.mongoUri = process.env.MONGO_URI || "";
    this.googleCredentials = {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }
    this.jswSecret = process.env.JWT_SECRET || "";
    this.loginRedirectPath = process.env.LOGIN_REDIRECT_PATH;
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
  MISSING_NODE_ENV = "Environment variable 'NODE_ENV' is missing. Please set it to either 'development' or 'production' in your .env file.",
  INVALID_NODE_ENV = "Invalid value for 'NODE_ENV'. Expected: 'development' or 'production'. Please update your .env file.",
  MISSING_PORT = "Environment variable 'PORT' is missing. Please define a valid port number in your .env file.",
  INVALID_PORT = "Invalid 'PORT' value detected. It must be a positive integer.",
  MISSING_MONGO_URI = "Environment variable 'MONGO_URI' is missing. Please specify the database connection string in your .env file.",
  MISSING_GOOGLE_CLIENT_ID = "Environment variable 'GOOGLE_CLIENT_ID' is missing. Please specify the database connection string in your .env file.",
  MISSING_GOOGLE_CLIENT_SECRET = "Environment variable 'GOOGLE_CLIENT_SECRET' is missing. Please specify the database connection string in your .env file.",
  MISSING_JWT_SECRET = "Environment variable 'JWT_SECRET' is missing. Please specify the database connection string in your .env file.",
}


/**
 * Validates that all required environment variables are correctly set.
 * Throws a `ConfigError` if any required variable is missing or invalid.
 *
 * @param {NodeJS.ProcessEnv} env - The environment variables object.
 * @throws {ConfigError} - If any required variable is missing or invalid.
 */
function validateEnvironment(env: any) {
  if (!env?.NODE_ENV) {
    throw new ConfigError(ValidationErrors.MISSING_NODE_ENV);
  }

  if (!Object.values(NodeEnv).includes(env?.NODE_ENV as NodeEnv)) {
    throw new ConfigError(ValidationErrors.INVALID_NODE_ENV);
  }

  if (!env.PORT) {
    throw new ConfigError(ValidationErrors.MISSING_PORT);
  }

   // Ensures that PORT is a valid positive number
  if (isNaN(env.PORT) || Number(env.PORT) < 0) {
    throw new ConfigError(ValidationErrors.INVALID_PORT);
  }
  
  if (!env.MONGO_URI || !env.MONGO_URI.trim()) {
    throw new ConfigError(ValidationErrors.MISSING_MONGO_URI);
  }

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_ID.trim()) {
    throw new ConfigError(ValidationErrors.MISSING_GOOGLE_CLIENT_ID);
  }

  if (!env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CLIENT_SECRET.trim()) {
    throw new ConfigError(ValidationErrors.MISSING_GOOGLE_CLIENT_SECRET);
  }

  if (!env.JWT_SECRET || !env.JWT_SECRET.trim()) {
    throw new ConfigError(ValidationErrors.MISSING_JWT_SECRET);
  }
}
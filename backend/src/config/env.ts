import 'dotenv/config';
import {z} from 'zod';

/**
 * Zod schema used to validate and transform environment variables.
 * - Ensures all required variables exist
 * - Validates types and formats
 * - Provides developer-friendly error messages on failure
 */
const envSchema = z.object({
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, {message: 'GOOGLE_CLIENT_ID is required'}),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, {message: 'GOOGLE_CLIENT_SECRET is required'}),
  JWT_SECRET: z.string().min(1, {message: 'JWT_SECRET is required'}),
  LOGIN_REDIRECT_PATH: z.string().optional(),
  MONGO_URI: z.string().min(1, {message: 'MONGO_URI is required'}),
  NODE_ENV: z.enum(['development', 'production'], {
    errorMap: () => ({
      message: "NODE_ENV must be 'development' or 'production'",
    }),
  }),
  PORT: z
    .string()
    .regex(/^\d+$/, {message: 'PORT must be a valid number'})
    .transform(Number), // ensures PORT is parsed into a number
});

/**
 * Type representing the validated environment variables.
 * Inferred from the Zod schema.
 */
type EnvVars = z.infer<typeof envSchema>;

/**
 * Singleton class responsible for:
 * - Loading environment variables (from `process.env`)
 * - Validating them against the schema
 * - Providing safe and typed access to them across the application
 *
 * This ensures the application fails fast on misconfiguration,
 * rather than failing at runtime later.
 */
export class Environment {
  static instance: Environment;
  env: EnvVars;

  /**
   * Private constructor ensures instantiation only via `getInstance` or `init`.
   * Loads and validates environment variables at startup.
   */
  private constructor() {
    this.env = Environment.loadEnvironment();
  }

  /**
   * Parses and validates environment variables against the schema.
   * If invalid, logs all errors and terminates the process.
   *
   * @returns {EnvVars} - Object containing validated environment variables.
   */
  private static loadEnvironment(): EnvVars {
    try {
      const env: EnvVars = envSchema.parse(process.env);
      return env;
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error('❌ Invalid environment configuration:');
        err.errors.forEach(e => {
          console.error(`- ${e.path.join('.')}: ${e.message}`);
        });
        process.exit(1); // Stop app if environment is invalid
      } else {
        throw err; // Unexpected error
      }
    }
  }

  /**
   * Returns the singleton instance of the Environment class.
   * Initializes it if it does not already exist.
   *
   * @returns {Environment} - Singleton instance.
   */
  static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  /**
   * Forces initialization of the singleton instance.
   * Useful for testing or reloading environment variables.
   *
   * @returns {Environment} - New instance of the Environment class.
   */
  static init(): Environment {
    Environment.instance = new Environment();
    return Environment.instance;
  }

  /**
   * Provides safe, typed access to a specific environment variable.
   *
   * @param key - The key of the environment variable
   * @returns The validated and typed value of the requested variable
   */
  public get<K extends keyof EnvVars>(key: K): EnvVars[K] {
    return this.env[key];
  }
}

/**
 * Initializes the environment singleton.
 * Can be called at application startup.
 */
export const initEnv = (): Environment => Environment.init();

/**
 * Exported constants for direct access to commonly used environment variables.
 * These are loaded via the singleton and type-checked at startup.
 */
export const GOOGLE_CLIENT_ID =
  Environment.getInstance().get('GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET = Environment.getInstance().get(
  'GOOGLE_CLIENT_SECRET',
);
export const JWT_SECRET = Environment.getInstance().get('JWT_SECRET');
export const LOGIN_REDIRECT_PATH = Environment.getInstance().get(
  'LOGIN_REDIRECT_PATH',
);
export const MONGO_URI = Environment.getInstance().get('MONGO_URI');
export const NODE_ENV = Environment.getInstance().get('NODE_ENV');
export const PORT = Environment.getInstance().get('PORT');

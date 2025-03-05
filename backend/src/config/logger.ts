import { NodeEnv } from "./env";
import winston from "winston";
import { ConfigError } from "./exceptions";

/**
 * Custom winston formatter for the messages that are printed 
 * on the console.
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }), // Apply colors
  winston.format.printf(({ level, message }) => {
    return `[${level}] ${message}`;
  })
);

/**
 * Custom winston formatter for the messages that are exported
 * to log files.
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.json()
)

/**
 * Singleton that handles the logging configuration.
 */
class Logger {
  static instance: Logger;
  logger: winston.Logger;

  private constructor(nodeEnv: NodeEnv) {
    this.logger = winston.createLogger({
      level: nodeEnv === NodeEnv.PRODUCTION ? "info" : "debug",
      format: fileFormat,
      // defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),

        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
      ]
    });
  }

  /**
   * Creates a Winston logger.
   * 
   * @param nodeEnv Node Environment. Ex: 'production'
   * @returns a Winston Logger
   */
  public static initLogger(nodeEnv: NodeEnv) {
    if (Logger.instance) {
      throw new ConfigError("Logger already initialized");
    }
    
    Logger.instance = new Logger(nodeEnv);
    return Logger.instance.logger;
  }

  /**
   * Gets the Winston logger.
   * 
   * @throws ConfigError if the logger is already initialized.
   * @returns a Winston Logger
   */
  public static getLogger() {
    if (!Logger.instance) {
      throw new ConfigError("Logger not initialized. Run initLogger first.");
    }
    return Logger.instance.logger;
  }
}


/**
 * Convenient functions for using Logger functions.S
 */
export const initLogger = (nodeEnv: NodeEnv) => Logger.initLogger(nodeEnv);

export const getLogger = () => Logger.getLogger();


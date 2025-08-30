import { NODE_ENV } from "./env";
import winston from "winston";

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

  public constructor() {
    this.logger = winston.createLogger({
      level: NODE_ENV === "production" ? "info" : "debug",
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
   * Gets the Winston logger.
   * 
   * @returns a Winston Logger
   */
  public static getLogger() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance.logger;
  }
}

/**
 * Convenient functions for using Logger functions.
 */
export default Logger.getLogger();


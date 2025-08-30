/**
 * Routes used for handling word translations and available languages.
 *
 * These functions return Express routers that can be mounted in the main app
 * (e.g., `app.use('/translate', getTranslateRoutes())`).
 *
 * --- Translation Routes ---
 * Base path: /translate
 *
 * Routes:
 *  - GET    /             → Returns paginated list of translations (flattened)
 *  - GET    /:word        → Returns translation for a specific word in a given language (query param)
 *  - POST   /create       → Creates a new translation entry
 *  - PUT    /update       → Updates an existing translation entry
 *
 * --- Language Routes ---
 * Base path: /languages
 *
 * Routes:
 *  - GET    /             → Returns paginated list of available languages
 *  - POST   /create       → Creates a new language (e.g., Spanish - "es")
 *  - PUT    /update       → Updates an existing language by code
 *
 * @returns Express.Router instances with the defined routes.
 */

import {Router} from 'express';
import {
  createLanguageController,
  createTranslationController,
  getLanguagesController,
  getTranslationController,
  getTranslationsController,
  updateLanguageController,
  updateTranslationController,
} from '../controllers/translateControllers';
import {useExceptionsMiddleware} from '../middleware/exceptions';

/**
 * Defines and returns routes related to translations.
 *
 * @example
 * app.use('/translate', getTranslateRoutes());
 */
export function getTranslateRoutes() {
  const router = Router();

  router.get('/', useExceptionsMiddleware(getTranslationsController)); // Paginated list of all translations
  router.get('/:word', useExceptionsMiddleware(getTranslationController)); // Translation for a specific word
  router.post('/create', useExceptionsMiddleware(createTranslationController)); // Create new translation
  router.put('/update', useExceptionsMiddleware(updateTranslationController)); // Update existing translation

  return router;
}

/**
 * Defines and returns routes related to languages.
 *
 * @example
 * app.use('/languages', getLanguageRoutes());
 */
export function getLanguageRoutes() {
  const router = Router();

  router.get('/', useExceptionsMiddleware(getLanguagesController)); // Paginated list of all languages
  router.post('/create', useExceptionsMiddleware(createLanguageController)); // Create new language
  router.put('/update', useExceptionsMiddleware(updateLanguageController)); // Update language by code

  return router;
}

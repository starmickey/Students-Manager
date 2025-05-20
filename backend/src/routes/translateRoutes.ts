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

/**
 * Routes used for handling word translations
 *
 * @returns an Express Router
 */
export function getTranslateRoutes() {
  const router = Router();

  router.get('/', getTranslationsController);
  router.get('/:word', getTranslationController);
  router.post('/create', createTranslationController);
  router.put('/update', updateTranslationController);

  return router;
}

export function getLanguageRoutes() {
  const router = Router();

  router.get('/', getLanguagesController);
  router.post('/create', createLanguageController);
  router.put('/update', updateLanguageController);

  return router;
}

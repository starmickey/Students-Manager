import {Request, Response} from 'express';
import {
  createLanguage,
  createTranslation,
  getLanguagesPage,
  getTranslation,
  getTranslationsPage,
  updateLanguage,
  updateTranslation,
} from '../repository/translatorRepository';
import {handleExceptionResponse} from './exceptionsHandler';
import {
  createLanguageSchema,
  createTranslationSchema,
  getTranslationSchema,
  updateLanguageSchema,
  updateTranslationSchema,
} from '../schema/translatorSchemas';
import {paginationSchema} from '../schema/commonSchemas';
import {flatenTranslation} from '../services/translationServices';

/**
 * Controller for retrieving a paginated list of available languages.
 * 
 * Query Parameters:
 *  - page: (number) Current page number
 *  - pageSize: (number) Number of items per page
 *  - sort: (string) Sorting criteria (e.g., "name:asc")
 * 
 * Response:
 *  - 200 OK: Returns paginated language data
 *  - 400 Bad Request: If query params are invalid
 */
export async function getLanguagesController(req: Request, res: Response) {
  try {
    const {page, pageSize, sort} = paginationSchema.parse(req.query);
    const result = await getLanguagesPage({page, pageSize, sort});
    res.send(result);
  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

/**
 * Controller for creating a new language.
 * 
 * Body Parameters:
 *  - name: (string) Full language name (e.g., "Spanish")
 *  - code: (string) Two-letter language code (e.g., "es")
 * 
 * Response:
 *  - 201 Created: Returns the created language object
 *  - 400 Bad Request: If the input schema is invalid or language already exists
 */
export async function createLanguageController(req: Request, res: Response) {
  try {
    const {name, code} = createLanguageSchema.parse(req.body);
    const language = await createLanguage(name, code);
    res.status(201).send(language);
  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

/**
 * Controller for updating an existing language by its code.
 * 
 * Body Parameters:
 *  - code: (string) Language code to identify the language to update
 *  - name: (string) New name to assign
 * 
 * Response:
 *  - 204 No Content: Language updated successfully
 *  - 400 Bad Request: If language does not exist or input is invalid
 */
export async function updateLanguageController(req: Request, res: Response) {
  try {
    const {name, code} = updateLanguageSchema.parse(req.body);
    const language = await updateLanguage(code, name);
    res.status(204).send(language);
  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

/**
 * Controller for creating a new translation entry.
 * 
 * Body Parameters:
 *  - word: (string) English key to identify the translation (lowercase)
 *  - translations: (object) Key-value pairs of languageCode -> translated text
 *    Example: { "es": "Hola", "fr": "Bonjour" }
 * 
 * Response:
 *  - 201 Created: Returns the created translation object
 *  - 400 Bad Request: If validation fails or language codes are invalid
 */
export async function createTranslationController(req: Request, res: Response) {
  try {
    const {word, translations} = createTranslationSchema.parse(req.body);
    const translation = await createTranslation(word, translations);
    res.status(201).send(translation);
  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

/**
 * Controller for updating an existing translation entry.
 * 
 * Body Parameters:
 *  - word: (string) English key to identify the translation to update
 *  - translations: (object) Key-value pairs of updated translations
 * 
 * Response:
 *  - 204 No Content: Translation updated successfully
 *  - 400 Bad Request: If the translation does not exist or input is invalid
 */
export async function updateTranslationController(req: Request, res: Response) {
  try {
    const {word, translations} = updateTranslationSchema.parse(req.body);
    const translation = await updateTranslation(word, translations);
    res.status(204).send(translation);
  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

/**
 * Controller for retrieving a specific translation in a given language.
 * 
 * Parameters:
 *  - word: (string) English key of the word or phrase
 *  - language: (string) Target language code
 * 
 * Response:
 *  - 200 OK: Returns { translation: string }
 *  - 200 OK (fallback): Returns { translation: word } if not found
 *  - 400 Bad Request: If parameters are invalid
 */
export async function getTranslationController(req: Request, res: Response) {
  try {
    const {word, language} = getTranslationSchema.parse({
      ...req.params,
      ...req.query,
    });
    const translation = await getTranslation(word, language);
    res.send({translation});
  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

/**
 * Controller for retrieving a paginated list of translations.
 * 
 * Query Parameters:
 *  - page: (number) Current page number
 *  - pageSize: (number) Number of items per page
 *  - sort: (string) Sorting criteria
 * 
 * Response:
 *  - 200 OK: Returns paginated translations data with flattened entries
 *  - 400 Bad Request: If query parameters are invalid
 */
export async function getTranslationsController(req: Request, res: Response) {
  try {
    const {page, pageSize, sort} = paginationSchema.parse(req.query);
    const result = await getTranslationsPage({page, pageSize, sort});
    const formattedData = result.data.map(entry => flatenTranslation(entry));
    res.send({...result, data: formattedData});
  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

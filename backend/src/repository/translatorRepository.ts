import {BadRequest} from '../config/exceptions';
import logger from '../config/logger';
import {
  ILanguage,
  ITranslation,
  Language,
  Translation,
} from '../models/translatorModels';
import {fetchPage, FetchPageProps} from './common';

/**
 * Fetches a paginated list of languages.
 *
 * @function getLanguagesPage
 * @param {Omit<FetchPageProps<ILanguage>, 'model'>} props - Pagination and filter options
 * @returns {Promise<PaginatedResult<ILanguage>>} List of languages matching the query
 */
export const getLanguagesPage = async (
  props: Omit<FetchPageProps<ILanguage>, 'model'>,
) => fetchPage<ILanguage>({model: Language, ...props});

/**
 * Creates a new language entry.
 *
 * @function createLanguage
 * @param {string} name - Full name of the language (e.g., "English")
 * @param {string} code - Two-letter language code (e.g., "en")
 * @returns {Promise<ILanguage | null>} The created language document or null on failure
 * @throws {BadRequest} on duplicated name entry
 */
export async function createLanguage(
  name: string,
  code: string,
): Promise<ILanguage | null> {
  try {
    const language = new Language({name, code});
    return await language.save();
  } catch (err: any) {
    if (err.code === 11000) {
      throw new BadRequest('This language already exists');
    }

    // Re-throw other errors
    throw err;
  }
}

/**
 * Updates the name of an existing language identified by its code.
 *
 * @function updateLanguage
 * @param {string} code - Two-letter language code
 * @param {string} [name] - New name to assign
 * @returns {Promise<ILanguage | null>} Updated language document or null if not found
 */
export async function updateLanguage(
  code: string,
  name?: string,
): Promise<ILanguage | null> {
  const updatedLanguage = await Language.findOneAndUpdate(
    {code},
    {name},
    {new: true, runValidators: true},
  );
  return updatedLanguage;
}

/**
 * Creates a new translation entry.
 *
 * @function createTranslation
 * @param {string} key - Identifier for the word or phrase (in lowercase English)
 * @param {Record<string, string>} translations - Object mapping language codes to translations
 * @returns {Promise<ITranslation>} The created translation document
 * @throws {BadRequest} on duplicated key entry
 */
export async function createTranslation(
  key: string,
  translations: Record<string, string>,
): Promise<ITranslation> {
  try {
    const translation = new Translation({key, translations});
    return await translation.save();
  } catch (err: any) {
    if (err.code === 11000) {
      throw new BadRequest('A translation for this word already exists');
    }

    // Re-throw other errors
    throw err;
  }
}

/**
 * Updates an existing translation entry.
 *
 * @function updateTranslation
 * @param {string} key - Translation key to update
 * @param {Record<string, string>} translations - Updated set of translations
 * @returns {Promise<ITranslation | null>} Updated translation document or null if not found
 */
export async function updateTranslation(
  key: string,
  translations: Record<string, string>,
): Promise<ITranslation | null> {
  const updatedTranslation = await Translation.findOneAndUpdate(
    {key},
    {translations},
    {new: true, runValidators: true},
  );
  return updatedTranslation;
}

/**
 * Retrieves the translated word for a given key and language.
 * If the translation is missing, it logs a warning and returns the original key.
 *
 * @function getTranslation
 * @param {string} key - The translation key (in lowercase English)
 * @param {string} languageCode - Two-letter language code (e.g., "es")
 * @returns {Promise<string>} The translated string, or the original key if not found
 */
export async function getTranslation(
  key: string,
  languageCode: string,
): Promise<string> {
  const normalizedKey = key.toLowerCase().trim();
  const translation = await Translation.findOne({key: normalizedKey});
  const translatedWord = translation?.translations.get(languageCode);

  if (!translation || !translatedWord) {
    logger.warn(
      `Asked for a translation for the word '${normalizedKey}' to the language '${languageCode}' and it is unavailable.`,
    );
    return key;
  }

  return translatedWord;
}

/**
 * Fetches a paginated list of translations.
 *
 * @function getTranslationsPage
 * @param {Omit<FetchPageProps<ITranslation>, 'model'>} props - Pagination and filter options
 * @returns {Promise<PaginatedResult<ITranslation>>} List of translations matching the query
 */
export const getTranslationsPage = async (
  props: Omit<FetchPageProps<ITranslation>, 'model'>,
) => fetchPage<ITranslation>({model: Translation, ...props});

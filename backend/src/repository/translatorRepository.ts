import {getLogger} from '../config/logger';
import {
  ILanguage,
  ITranslation,
  Language,
  Translation,
} from '../models/translatorModels';
import {fetchPage, FetchPageProps} from './common';

export const getLanguagesPage = async (
  props: Omit<FetchPageProps<ILanguage>, 'model'>,
) => fetchPage<ILanguage>({model: Language, ...props});

export async function createLanguage(
  name: string,
  code: string,
): Promise<ILanguage | null> {
  const language = new Language({name, code});
  return await language.save();
}

export async function updateLanguage(
  code: string,
  name?: string,
): Promise<ILanguage | null> {
  const updatedLanguage = await Language.findOneAndUpdate(
    {code}, // Find by code
    {name}, // Update name
    {new: true, runValidators: true},
  );
  return updatedLanguage;
}

export async function createTranslation(
  key: string,
  translations: Record<string, string>,
): Promise<ITranslation> {
  const translation = new Translation({key, translations});
  return await translation.save();
}

export async function updateTranslation(
  key: string,
  translations: Record<string, string>,
): Promise<ITranslation | null> {
  const updatedTranslation = await Translation.findOneAndUpdate(
    {key}, // Find by key (name)
    {translations}, // Update translations
    {new: true, runValidators: true}, // Return updated document and apply validation
  );

  return updatedTranslation;
}

export async function getTranslation(
  key: string,
  languageCode: string,
): Promise<string> {
  const logger = getLogger();

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

export const getTranslationsPage = async (
  props: Omit<FetchPageProps<ITranslation>, 'model'>,
) => fetchPage<ITranslation>({model: Translation, ...props});

import { getLogger } from "../config/logger";
import { Translation } from "../models/translatorModels";


export async function getTranslation(key: string, languageCode: string) {
  const logger = getLogger();

  try {
    const normalizedKey = key.toLowerCase().trim();
    const translation = await Translation.findOne({ key: normalizedKey });
    const translatedWord = translation?.translations.get(languageCode);

    if (!translation || !translatedWord) {
      logger.warn(`Asked for a translation for the word ${translation} to the language ${languageCode} and it is unavailable.`);
      return key;
    }
    return translatedWord;

  } catch (error) {
    console.error("Error fetching translation:", error);
    return key;
  }
}
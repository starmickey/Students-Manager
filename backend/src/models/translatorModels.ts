import { Model, model, Query, Schema, Document } from "mongoose";
import { BadRequest } from "../config/exceptions";
import { withHelpers } from "../config/helpers/mongooseHelpers";

/**
 * LANGUAGE MODEL
 * 
 * Stores available languages for the application.
 * 
 * Attributes:
 *   - name: Full language name in English (e.g., "english", "spanish")
 *   - code: Two-letter ISO language code (e.g., "en", "es")
 */

// Language Interface
interface ILanguage extends Document {
  name: string;
  code: string;
}

// Language Schema
const languageSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
});

/**
 * TRANSLATION MODEL
 * 
 * Stores translations for interface strings.
 * 
 * Attributes:
 *   - key: Unique string identifier in lowercase English (e.g., "hello", "student_list")
 *   - translations: A map of translations for each language code, e.g., { "en": "Hello", "es": "Hola" }
 */

// Translation Interface
interface ITranslation extends Document {
  key: string;
  translations: Map<string, string>;
}

// Translation Schema
const translationSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  translations: {
    type: Map,
    of: String,
    required: true,
  }
});

/**
 * Pre-save hook to sanitize and validate the `translations` map and normalize the key.
 * 
 * @function
 * @param {Function} next - Mongoose middleware continuation function
 */
translationSchema.pre<ITranslation>("save", async function (next) {
  // Parse and validate translations (e.g., validate language codes)
  this.translations = await parseTranslations(this.translations.entries());

  // Normalize key to lowercase
  this.key = this.key.trim().toLowerCase();

  next();
});

/**
 * Pre-update hook for `findOneAndUpdate` to validate translation keys and normalize the key.
 * 
 * @function
 * @param {Function} next - Mongoose middleware continuation function
 */
translationSchema.pre<Query<ITranslation, ITranslation>>("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;

  // If no translations are updated, skip validation
  if (!update.translations) {
    return next();
  }

  // Validate that each language key in the update exists
  for (const key of Object.keys(update.translations)) {
    const lang = await Language.findOne({ code: key });
    if (!lang) {
      throw new BadRequest(`${key} is not a valid language code`);
    }
  }

  // Normalize the key if it's present in the update
  if (update.key) {
    update.key = update.key.trim().toLowerCase();
  }

  // Apply the updated object back to the query
  this.setUpdate(update);

  next();
});

/**
 * Parses and validates a MapIterator of translations.
 * Ensures that all language keys exist and converts keys to lowercase.
 * 
 * @function parseTranslations
 * @param {MapIterator<[string, string]>} translations - Map iterator containing language keys and translated values
 * @returns {Promise<Map<string, string>>} A validated and normalized translations map
 * 
 * @example
 * const parsed = await parseTranslations([['en', 'Hello'], ['es', 'Hola']].entries())
 */
async function parseTranslations(translations: MapIterator<[string, string]>): Promise<Map<string, string>> {
  const formattedTranslations = new Map<string, string>();

  for (const [key, value] of translations) {
    // Ensure the language code exists
    const lang = await Language.findOne({ code: key });
    if (!lang) {
      throw new BadRequest(`${key} is not a valid language code`);
    }

    // Store translation with lowercase language code
    formattedTranslations.set(key.toLowerCase(), value);
  }

  return formattedTranslations;
}

// Mongoose Models
const LanguageModel: Model<ILanguage> = model<ILanguage>("Language", languageSchema);
const TranslationModel: Model<ITranslation> = model<ITranslation>("Translation", translationSchema);

const Language = withHelpers<ILanguage, typeof LanguageModel>(LanguageModel);
const Translation = withHelpers<ITranslation, typeof TranslationModel>(TranslationModel);

// Export interfaces and models
export {
  ILanguage,
  ITranslation,
  Language,
  Translation
};

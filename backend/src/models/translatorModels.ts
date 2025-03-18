import { Model, model, Query, Schema } from "mongoose";
import { BadRequest } from "../config/exceptions";

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

// Translation interface
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
    of: String, // Stores translations per language (e.g., { 'en': 'Hello', 'es': 'Hola' })
    required: true,
  }
});

// Pre-save hook
translationSchema.pre<ITranslation>("save", async function (next) {
  // Validate and normalize fields
  this.translations = await parseTranslations(this.translations.entries())

  // Cast translation key to lower case
  this.key = this.key.trim().toLowerCase();

  next();
});

// Pre-update hook
translationSchema.pre<Query<ITranslation, ITranslation>>("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any; 

  // If translations is not part of the update object, just proceed
  if (!update.translations) {
    return next();
  }

  // Validate that keys are valid languages
  for (const key of Object.keys(update.translations)) {
    const lang = await Language.findOne({ code: key });
    if (!lang) {
      throw new BadRequest(`${key} is not a valid language code`);
    }
  }

  // Ensure key is lowercase if it's being updated
  if (update.key) {
    update.key = update.key.trim().toLowerCase();
  }

  // Apply modifications back to the update object
  this.setUpdate(update);

  next();
});

async function parseTranslations(translations: MapIterator<[string, string]>) {
  const formattedTranslations = new Map<string, string>();

  for (const [key, value] of translations) {
    // Validate that key is a valid language code
    const lang = await Language.findOne({ code: key });
    if (!lang) {
      throw new BadRequest(`${key} is not a valid language code`);
    }

    // Cast translation keys to lowercase
    formattedTranslations.set(key.toLowerCase(), value);
  }

  return formattedTranslations;
}

const Language: Model<ILanguage> = model<ILanguage>("Language", languageSchema);
const Translation: Model<ITranslation> = model<ITranslation>("Translation", translationSchema);

export {
  ILanguage,
  ITranslation,
  Language,
  Translation
};

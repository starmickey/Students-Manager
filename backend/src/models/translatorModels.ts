import { Model, model, Schema } from "mongoose";

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

// Pre-save hook to normalize fields
translationSchema.pre<ITranslation>("save", function (next) {
  this.key = this.key.trim().toLowerCase(); 
  next();
});

const Language: Model<ILanguage> = model<ILanguage>("Language", languageSchema);
const Translation: Model<ITranslation> = model<ITranslation>("Translation", translationSchema);

export {
  ILanguage,
  ITranslation,
  Language,
  Translation
};

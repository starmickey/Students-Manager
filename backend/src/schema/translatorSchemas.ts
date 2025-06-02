import { z } from "zod";

/**
 * createLanguageSchema
 * 
 * Schema for validating the creation of a new language.
 * 
 * Fields:
 *  - name: (string) Required. The full name of the language (e.g., "english", "spanish").
 *  - code: (string) Required. The language code, typically two characters (e.g., "en", "es").
 */
export const createLanguageSchema = z.object({
  name: z
    .string({ message: "Missing field 'name'" })
    .min(1, { message: "'name' field is empty" }),
  code: z
    .string({ message: "Missing field 'code'" })
    .min(1, { message: "'code' field is empty" }),
});

/**
 * updateLanguageSchema
 * 
 * Schema for updating a language.
 * Reuses the same structure as createLanguageSchema.
 */
export const updateLanguageSchema = createLanguageSchema;

/**
 * createTranslationSchema
 * 
 * Schema for creating a new translation entry.
 * 
 * Fields:
 *  - word: (string) Required. The key word or phrase to translate.
 *  - translations: (Record<string, string>) Required. 
 *      An object mapping language codes to their respective translated strings.
 *      Must include at least one translation.
 */
export const createTranslationSchema = z.object({
  word: z
    .string({ message: "Missing field 'word'" })
    .min(1, { message: "'word' field is empty" }),
  translations: z
    .record(
      z.string({ message: "Language keys must be strings" }),
      z.string({ message: "Translations must be strings" }),
      { required_error: "Include at least one translation" }
    ),
});

/**
 * updateTranslationSchema
 * 
 * Schema for updating a translation.
 * Reuses the same structure as createTranslationSchema.
 */
export const updateTranslationSchema = createTranslationSchema;

/**
 * getTranslationSchema
 * 
 * Schema for fetching a single translation.
 * 
 * Fields:
 *  - word: (string) Required. The key word or phrase to translate.
 *  - language: (string) Required. The language code for the desired translation.
 */
export const getTranslationSchema = z.object({
  word: z
    .string({ message: "Missing field 'word'" })
    .min(1, { message: "'word' field is empty" }),
  language: z
    .string({ message: "Missing field 'language'" })
    .min(1, { message: "'language' field is empty" }),
});

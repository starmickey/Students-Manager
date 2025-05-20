import { z } from "zod";

export const createLanguageSchema = z.object({
  name: z
    .string({ message: "Missing field 'name'" })
    .min(1, { message: "'name' field is empty" }),
  code: z
    .string({ message: "Missing field 'code'" })
    .min(1, { message: "'code' field is empty" }),
});

export const updateLanguageSchema = createLanguageSchema;

export const createTranslationSchema = z.object({
  word: z
    .string({ message: "Missing field 'word'" })
    .min(1, { message: "'word' field is empty" }),
  translations: z
    .record(
      z.string({ message: "Language keys must be strings" }),
      z.string({ message: "Translations must be strings" }),
      { required_error: "Include at least one translation"}
    ),
});

export const updateTranslationSchema = createTranslationSchema;

export const getTranslationSchema = z.object({
  word: z
    .string({ message: "Missing field 'word'" })
    .min(1, { message: "'word' field is empty" }),
  language: z
    .string({ message: "Missing field 'language'" })
    .min(1, { message: "'language' field is empty" }),
});


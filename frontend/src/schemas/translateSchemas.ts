import z from "zod";

const KEY_LANG = { code: "en", name: "English" };

/**
 * Schema: createTranslationSchema
 *
 * Validates an array of word entries used to create a translation.
 * Each entry contains:
 * - `word`: must be a non-empty, meaningful string (not just symbols or whitespace).
 * - `langCode`: must be a non-empty string representing the language code.
 *
 * The schema ensures:
 * - At least one entry must exist in the key language (English).
 * - Transforms the array into `{ word, translations }` format:
 *   - `word`: the English term (used as the translation key).
 *   - `translations`: an object of `{ [langCode]: word }`.
 */
export const createTranslationSchema = z
  .array(
    z.object({
      word: z
        .string({
          required_error: "Word is required",
          invalid_type_error: "Word must be a string",
        })
        .min(1, { message: "Word cannot be empty" })
        .refine((val) => !!val.trim() && /[a-zA-Z0-9]/.test(val), {
          message: "Word must contain meaningful characters",
        }),
      langCode: z
        .string({
          required_error: "Language is required",
          invalid_type_error: "Language code must be a string",
        })
        .min(1, { message: "Language code cannot be empty" }),
    })
  )
  .refine(
    (words) =>
      words.some((w) => w.langCode === KEY_LANG.code && w.word.trim() !== ""),
    {
      message: `At least one word must be in ${KEY_LANG.name}`,
    }
  )
  .transform((words) => {
    const keyEntry = words.find((w) => w.langCode === KEY_LANG.code)!;

    const translations = words.reduce<Record<string, string>>((acc, w) => {
      acc[w.langCode] = w.word;
      return acc;
    }, {});

    return {
      word: keyEntry.word,
      translations,
    };
  });

/**
 * Parses Zod errors from `createTranslationSchema.safeParse()` result.
 *
 * Splits validation errors into:
 * - `fields`: a map of errors per array index and field (word/langCode)
 * - `logic`: any non-field (schema-level) validation errors
 *
 * @param error - A ZodError generated from the failed safeParse
 * @returns An object with `fields` and a combined `logic` message
 */
export function parseCreateTranslationSchemaErrors(
  error: z.ZodError<
    {
      word: string;
      langCode: string;
    }[]
  >
) {
  const fieldErrors: Record<number, { word?: string; langCode?: string }> = {};
  const logicErrors: string[] = [];

  error.errors.forEach((err) => {
    const path = err.path;

    if (typeof path[0] === "number") {
      const index = path[0];
      const field = path[1] as "word" | "langCode";
      if (!fieldErrors[index]) fieldErrors[index] = {};
      fieldErrors[index][field] = err.message;
    } else {
      logicErrors.push(err.message);
    }
  });

  return {
    fields: fieldErrors,
    logic: logicErrors.join(", "),
  };
}

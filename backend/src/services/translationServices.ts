import { ITranslation } from "../models/translatorModels";

/**
 * flatenTranslation
 * 
 * Converts an ITranslation document into a flat object format
 * by spreading the translations Map entries as key-value pairs alongside the translation key.
 * 
 * @param translation - ITranslation document containing the translation key and a Map of language translations
 * 
 * @returns Record<string, string> - An object with the translation key and language codes mapped to their translated strings
 * 
 * @example
 * ```ts
 * const flat = flatenTranslation(translationDoc);
 * // Result: { key: 'hello', en: 'Hello', es: 'Hola', fr: 'Bonjour' }
 * ```
 */
export function flatenTranslation(translation: ITranslation): Record<string, string> {
  return {
    key: translation.key,
    ...Object.fromEntries(translation.translations)
  }
}

import { ITranslation } from "../models/translatorModels";

export function flatenTranslation (translation: ITranslation): Record<string, string> {
  return {
    key: translation.key,
    ...Object.fromEntries(translation.translations)
  }
}
import { getEnvironment } from "@/config/env";

export async function fetchTranslation(word: string, languageCode: string): Promise<string> {
  const { serverURI } = getEnvironment();

  const url = new URL("/translate", serverURI);
  url.searchParams.append("word", word);
  url.searchParams.append("language", languageCode);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const { translation } = await response.json();

  return translation;

  // return new Promise(((resolve) => {
  //   setTimeout(() => {
  //     resolve(translation)
  //   }, 3000)
  // }))
}

export async function fetchTranslations(words: string[], lang: string) {
  const promises = words.map(w => fetchTranslation(w, lang));
  const translations = await Promise.all(promises);
  return translations;
}

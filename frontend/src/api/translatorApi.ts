import { getEnvironment } from "@/config/env";

export async function fetchTranslation(word: string): Promise<string> {
  const { serverURI, language } = getEnvironment();

  // Pass the word as a path param
  const url = new URL(`/translate/${encodeURIComponent(word)}`, serverURI);
  url.searchParams.append("language", language);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const { translation } = await response.json();

  return translation;
}

export async function fetchTranslations(words: string[]) {
  const promises = words.map((w) => fetchTranslation(w));
  const translations = await Promise.all(promises);
  return translations;
}

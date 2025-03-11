import { getEnvironment } from "@/config/env";

export async function fetchTranslation(word: string, languageCode: string) {
  const { serverURI } = getEnvironment();

  const url = new URL('/translate', serverURI);
  url.searchParams.append('word', word);
  url.searchParams.append('language', languageCode);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const { translation } = await response.json();

  return translation;
}
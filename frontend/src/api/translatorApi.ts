import { getEnvironment } from "@/config/env";
import { fetchPage, FetchPageProps } from "./common";

interface ITranslation {
  key: string;
  translations: Record<string, string>;
}

interface ILanguage extends Document {
  name: string;
  code: string;
}

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

  // return new Promise(((resolve) => {
  //   setTimeout(() => {
  //     resolve(translation)
  //   }, 3000)
  // }))
}

export async function fetchTranslations(words: string[]) {
  const promises = words.map((w) => fetchTranslation(w));
  const translations = await Promise.all(promises);
  return translations;
}

export const fetchTranslationsPage = async (
  props?: Omit<FetchPageProps, "api">
) => fetchPage<ITranslation>({ api: "translate", ...props });

export const fetchLanguagesPage = async (props?: Omit<FetchPageProps, "api">) =>
  fetchPage<ILanguage>({ api: "languages", ...props });

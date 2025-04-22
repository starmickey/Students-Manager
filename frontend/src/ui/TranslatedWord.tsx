import { fetchTranslation } from "@/api/translatorApi";
import { Suspense } from "react";
import WordSkeleton from "./WordSkeleton";

export async function TranslatedWord({ word, lang }: { word: string, lang: string }) {
  const translation = await fetchTranslation(word, lang);
  return <>{translation}</>
}


export function TranslatedWordWrapper({ children, lang }: { children: string, lang: string }) {
  return (
    <Suspense fallback={<WordSkeleton />}>
      <TranslatedWord word={children} lang={lang}/>
    </Suspense>
  )
}
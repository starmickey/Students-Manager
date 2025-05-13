import { fetchTranslation } from "@/api/translatorApi";
import { Suspense } from "react";
import WordSkeleton from "./WordSkeleton";

export async function TranslatedWord({ word }: { word: string }) {
  const translation = await fetchTranslation(word);
  return <>{translation}</>
}


export function TranslatedWordWrapper({ children }: { children: string }) {
  return (
    <Suspense fallback={<WordSkeleton />}>
      <TranslatedWord word={children}/>
    </Suspense>
  )
}

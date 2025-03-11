import { fetchTranslation } from "@/api/translatorApi";
import { Suspense } from "react";

async function TranslatedWord({ word }:{ word: string}) {
  const translation = await fetchTranslation(word, "es");
  console.log("translation", translation);

  return <>{translation}</>
}

export default function TranslatedWordWrapper({ children }:{ children: string }) {
  return (
    <Suspense fallback={<span>...</span>}>
      <TranslatedWord word={children}/>
    </Suspense>
  )
}
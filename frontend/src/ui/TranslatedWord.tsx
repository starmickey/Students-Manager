"use client";

import { useEffect, useState } from "react";
import WordSkeleton from "./WordSkeleton";
import { useSearchParams } from "next/navigation";
import { translate } from "@/app/api/translate/route";

interface TranslatedWordProps {
  children: string;
}

export default function TranslatedWord({ children }: TranslatedWordProps) {
  const [loading, setLoading] = useState(true);
  const [translation, setTranslation] = useState("");

  const searchParams = useSearchParams();
  
  useEffect(() => {
    setLoading(true);
    const lang = searchParams.get("lang") || "en";

    const fetchTranslation = async () => {
      const word = children;
      await translate(word, lang).then((t) => setTranslation(t));
      setLoading(false);
    };

    fetchTranslation();
  }, [children, searchParams]);

  if (loading) {
    return <WordSkeleton />;
  }
  return <>{translation}</>;
}

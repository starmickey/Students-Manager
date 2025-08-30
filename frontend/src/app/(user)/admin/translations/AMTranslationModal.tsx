"use client";

import { createTranslationSchema } from "@/schemas/translateSchemas";
import { Language } from "@/types/translator";
import DialogWrapper, { Modal } from "@/ui/display/Dialog";
import Button from "@/ui/form/Button";
import Input from "@/ui/form/Input";
import Select from "@/ui/form/Select";
import T from "@/ui/TranslatedWord";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaRegTrashCan as TrashIcon } from "react-icons/fa6";
import { FaPlus as PlusIcon } from "react-icons/fa6";
import z from "zod";

interface WordDTO {
  word: string;
  langCode: string;
}

interface AMTranslationModalProps {
  languages: Language[];
  action: "create" | "update";
  trigger: ReactNode;
  word?: {
    key: string;
    translations: WordDTO[];
  };
}

/**
 * Modal for creating a new translation entry.
 * Users can input a key word (in English) and add translations in other languages.
 */
export default function AMTranslationModal({
  languages,
  action,
  trigger,
  word,
}: AMTranslationModalProps) {
  const router = useRouter();

  // Initialize one empty input with the first language
  const defaultWord: WordDTO = {
    word: "",
    langCode: languages?.[0]?.code || "",
  };

  // Words hook
  const [words, setWords] = useState<WordDTO[]>(
    action === "create" ? [defaultWord] : word?.translations || [defaultWord]
  );

  // Validation errors from Zod or API
  const [errors, setErrors] = useState<{
    fields?: Record<number, { word?: string; langCode?: string }>;
    logic?: string;
  }>({});

  // Used to force modal closure via key change
  const [forceCloseIdx, setForceCloseIdx] = useState<number>(0);

  /** Adds a new word input */
  const handleAddWord = () => {
    setWords((prev) => [...prev, defaultWord]);
  };

  /** Removes a word input by index */
  const handleRemoveWord = (index: number) => {
    setWords((prev) => prev.filter((_, i) => i !== index));
  };

  /** Adds a new row if the user interacts with the last empty one */
  const handleWordClick = (index: number) => {
    if (index === words.length - 1 && words[index].word === "") {
      handleAddWord();
    }
  };

  /** Updates the text value of a word */
  const handleWordChange = (index: number, newWord: string) => {
    setWords((prev) =>
      prev.map((w, i) => (i === index ? { ...w, word: newWord } : w))
    );
  };

  /** Updates the selected language of a word */
  const handleLangChange = (index: number, newLang: string) => {
    setWords((prev) =>
      prev.map((w, i) => (i === index ? { ...w, langCode: newLang } : w))
    );
  };

  /** Handles form submission */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filteredWords = words.filter((w) => w.word.trim() !== "");

    try {
      const validatedData = createTranslationSchema.parse(filteredWords);
      
      let res;

      if (action === "create") {
        res = await fetch("/api/translate/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validatedData),
        });
      } else {
        res = await fetch("/api/translate/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validatedData),
        });

      }

      if (!res.ok) {
        const { message } = await res.json();
        setErrors({ logic: message || "An unexpected error occurred." });
        return;
      }

      closeModal();
      router.refresh(); // Re-fetch table data
    } catch (error) {
      // Show Zod Errors
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0].toString()] = err.message;
          } else {
            fieldErrors.logic = err.message;
          }
        });
        setErrors(fieldErrors);
        console.error(fieldErrors);
      } else {
        console.error(error);
        setErrors({ logic: "Se produjo un error inesperado." });
      }
    }
  };

  /** Closes and resets the modal */
  const closeModal = () => {
    setForceCloseIdx((prev) => prev + 1);
  };

  /** Resets the form when the modal closes */
  const handleDialogClose = () => {
    setWords([defaultWord]);
    setErrors({});
  };

  return (
    <DialogWrapper
      lockBackground={false}
      forceCloseIdx={forceCloseIdx}
      onClose={handleDialogClose}
      trigger={trigger}
      dialog={
        <Modal>
          <form onSubmit={handleSubmit}>
            <h1 className="text-xl font-semibold mb-4">
              {action === "create" ? <T>Add word</T> : <T>Update word</T>}
            </ h1>

            {/* General (API or schema-level) logic error */}
            {errors.logic && (
              <div className="text-danger m-2 text-sm">
                <T>{errors.logic}</T>
              </div>
            )}

            {/* Word input rows */}
            <div className="flex flex-col gap-2 items-end">
              {words.map(({ word, langCode }, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <Input
                    id={`word-${index}`}
                    label="Word"
                    type="text"
                    value={word}
                    isRequired={false}
                    variant="primary"
                    placeholder="Enter a word"
                    aria-label="Enter a word"
                    errorMessage={errors.fields?.[index]?.word || ""}
                    onChange={(e) => handleWordChange(index, e.target.value)}
                    onClick={() => handleWordClick(index)}
                  />

                  <Select
                    id={`lang-${index}`}
                    name="lang"
                    label="Language"
                    variant="primary"
                    className="capitalize"
                    aria-label="Select a language"
                    isRequired={false}
                    errorMessage={errors.fields?.[index]?.langCode || ""}
                    value={langCode}
                    onChange={(e) => handleLangChange(index, e.target.value)}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </Select>

                  <Button
                    type="button"
                    className="w-12 h-14"
                    variant="primary-outline"
                    aria-label="Remove translation"
                    title="Remove translation"
                    onClick={() => handleRemoveWord(index)}
                  >
                    <TrashIcon />
                  </Button>
                  <Button
                    type="button"
                    className="w-12 h-14"
                    variant="primary"
                    aria-label="Add translation"
                    title="Add translation"
                    onClick={handleAddWord}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add translation button that only shows up when there are no translation inputs */}
            {words.length === 0 && (
              <div className="flex justify-center w-full">
                <Button
                  type="button"
                  variant="primary"
                  aria-label="Add translation"
                  title="Add translation"
                  onClick={handleAddWord}
                >
                  <T>Add translation</T>
                </Button>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex items-center justify-center gap-4 w-full">
              <Button type="submit" disabled={words.length === 0}>
                <T>Submit</T>
              </Button>
              <Button
                type="button"
                variant="primary-outline"
                onClick={closeModal}
              >
                <T>Cancel</T>
              </Button>
            </div>
          </form>
        </Modal>
      }
    />
  );
}

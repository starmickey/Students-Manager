import { getEnvironment } from "@/config/env";
import { NextResponse } from "next/server";

/**
 * GET /api/translate
 *
 * Proxies a request to the backend to fetch a translation for a specific word
 * in a specified language.
 *
 * Query Parameters:
 * - word: the key word to translate (required)
 * - lang: the language code to translate into (required)
 *
 * Success: returns { translation: string }
 * Failure: returns a 4xx or 5xx response with an error message
 */
export async function GET(req: Request) {
  const { serverURI } = getEnvironment();

  const { searchParams } = new URL(req.url);
  const word = searchParams.get("word");
  const language = searchParams.get("lang");

  // Validate query parameters
  if (!word) {
    return NextResponse.json({ error: "Missing word" }, { status: 400 });
  }
  if (!language) {
    return NextResponse.json({ error: "Missing language" }, { status: 400 });
  }

  try {
    const backendURL = new URL(`/translate/${encodeURIComponent(word)}`, serverURI);
    backendURL.searchParams.set("language", language);

    const response = await fetch(backendURL.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          message: errorData.message ?? "Failed to fetch translation.",
        },
        { status: response.status }
      );
    }

    const { translation } = await response.json();
    return NextResponse.json({ translation }, { status: 200 });

  } catch (error) {
    console.error("API Error: /api/translate", error);
    return NextResponse.json(
      { message: "Error fetching translations" },
      { status: 500 }
    );
  }
}

/**
 * Utility function for use in frontend components
 * to request a translation from the API.
 *
 * @param word - the word to translate
 * @param language - the target language code
 * @returns a translated string (or empty string if not found)
 */
export async function translate(word: string, language: string): Promise<string> {
  try {
    const res = await fetch(
      `/api/translate?word=${encodeURIComponent(word)}&lang=${language}`
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Translation fetch failed:", errorData);
      return "";
    }

    const { translation } = await res.json();
    return translation;
  } catch (err) {
    console.error("translate() error:", err);
    return "";
  }
}

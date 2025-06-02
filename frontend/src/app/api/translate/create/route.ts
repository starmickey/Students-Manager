import { NextRequest, NextResponse } from "next/server";
import { getEnvironment } from "@/config/env";

/**
 * Handles POST requests to create a new translation entry.
 *
 * This route receives JSON data from the client, and forwards it
 * to the backend server (controller) for processing.
 *
 * Expected request body:
 * {
 *   word: string,             // The key word (usually in English)
 *   translations: Record<string, string>  // Language code to translated word
 * }
 *
 * Success: returns 201 with success: true
 * Failure: returns 500 with an error message
 */
export async function POST(req: NextRequest) {
  const { serverURI } = getEnvironment(); // Get backend URL

  try {
    const body = await req.json();

    const response = await fetch(new URL("/translate/create", serverURI), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          message: errorData?.message ?? "Failed to create translation.",
          error: errorData?.error ?? null,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("API Error: /api/translate/create", err);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}

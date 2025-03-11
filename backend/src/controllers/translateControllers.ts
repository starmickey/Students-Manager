import { Request, Response } from "express";
import { getTranslation } from "../repository/translator";
import { z } from "zod";
import { handleExceptionResponse } from "./exceptionsHandler";

const getTranslationSchema = z.object({
  word: z
    .string({ message: "Word is required and must be an string" })
    .min(1, { message: "Word must have at least one character" }),
  language: z
    .string({ message: "Language is required and must be an string" })
    .min(1, { message: "Missing or invalid string field 'language'" }),
});

export async function getTranslationController(req: Request, res: Response) {
  try {
    const { word, language } = getTranslationSchema.parse(req.query);
    const translation = await getTranslation(word, language);
    res.send({ translation });

  } catch (error) {
    handleExceptionResponse(res, error);
  }

}
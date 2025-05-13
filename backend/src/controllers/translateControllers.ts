import { Request, Response } from "express";
import { createLanguage, createTranslation, getTranslation, updateLanguage, updateTranslation } from "../repository/translatorRepository";
import { handleExceptionResponse } from "./exceptionsHandler";
import { createLanguageSchema, createTranslationSchema, getTranslationSchema, updateLanguageSchema, updateTranslationSchema } from "../schema/translatorSchemas";

export async function createLanguageController(req: Request, res: Response) {
  try {
    const { name, code } = createLanguageSchema.parse(req.body);
    const language = await createLanguage(name, code);
    res.status(201).send(language);

  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

export async function updateLanguageController(req: Request, res: Response) {
  try {
    const { id, name, code } = updateLanguageSchema.parse(req.body);
    const language = await updateLanguage(id, name, code);
    res.status(204).send(language);
    
  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

export async function createTranslationController(req: Request, res: Response) {
  try {
    const { word, translations } = createTranslationSchema.parse(req.body);
    const translation = await createTranslation(word, translations);
    res.status(201).send(translation);

  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

export async function updateTranslationController(req: Request, res: Response) {
  try {
    const { word, translations } = updateTranslationSchema.parse(req.body);
    const translation = await updateTranslation(word, translations);
    res.status(204).send(translation);

  } catch (error) {
    handleExceptionResponse(res, error);
  }
}

export async function getTranslationController(req: Request, res: Response) {
  try {
    const { word, language } = getTranslationSchema.parse(req.query);
    const translation = await getTranslation(word, language);
    res.send({ translation });

  } catch (error) {
    handleExceptionResponse(res, error);
  }
}
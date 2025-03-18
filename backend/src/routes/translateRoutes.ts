import { Router } from "express";
import { createLanguageController, createTranslationController, getTranslationController, updateLanguageController, updateTranslationController } from "../controllers/translateControllers";

/**
 * Routes used for handling word translations
 * 
 * @returns an Express Router
 */
export function getTranslateRoutes() {

  const router = Router();
  
  router.get("/", getTranslationController);
  router.post("/create", createTranslationController);
  router.put("/update", updateTranslationController);

  return router;
}

export function getLanguageRoutes() {

  const router = Router();
  
  router.post("/create", createLanguageController);
  router.put("/update", updateLanguageController);

  return router;
}
import { Request, Response, Router } from "express";
import { getTranslationController } from "../controllers/translateControllers";

/**
 * Routes used for handling word translations
 * 
 * @returns an Express Router
 */
export function getTranslateRoutes() {

  const router = Router();
  
  router.get("/", getTranslationController);

  return router;
}
import { Request, Response, Router } from "express";

/**
 * Routes used for checking the server status
 * 
 * @returns an Express Router
 */
export function getControlRoutes() {

  const router = Router();
  
  router.get("/status", (req: Request, res: Response) => {
    res.send("I am running");
  });

  return router;
}
import { Request, Response, Router } from "express";

/**
 * Control Routes
 * 
 * Defines routes used for basic server health checks and status monitoring.
 * 
 * Routes:
 *  - GET /status
 *    - Purpose: Check if the server is running.
 *    - Response: Sends a plain text message "I am running".
 * 
 * @returns {Router} An Express Router configured with control routes.
 */
export function getControlRoutes() {

  const router = Router();
  
  router.get("/status", (req: Request, res: Response) => {
    res.send("I am running");
  });

  return router;
}

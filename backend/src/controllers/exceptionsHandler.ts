import { Response } from "express";
import { ZodError } from "zod";
import { APIError, ConfigError } from "../config/exceptions";

const statuses = [
  { type: ZodError, status: 400 },
]

function parseZodError(error: ZodError) {
  return error.errors.map(e => e.message).join(". ");
}

export function handleExceptionResponse(res: Response, error: any) {
  if (error instanceof ConfigError) {
    throw error;
  }

  const message =
    error instanceof ZodError ? parseZodError(error)
      : error.message || "Se produjo un error inesperado";

  const status =
    error instanceof APIError ? error.status
      : statuses.find(s => error instanceof s.type)?.status || 500;

  res.status(status).send({ message });
}
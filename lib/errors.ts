import { ZodError } from "zod";

export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function toApiError(error: unknown): {
  status: number;
  code: string;
  message: string;
  details?: unknown;
} {
  if (error instanceof HttpError) {
    return {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof ZodError) {
    return {
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Request validation failed.",
      details: error.issues,
    };
  }

  return {
    status: 500,
    code: "INTERNAL_ERROR",
    message: "Unexpected server error.",
  };
}

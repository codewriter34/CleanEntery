import type { Request, Response, NextFunction } from "express";
import type { CleanEntryOptions } from "../config/types";
import { createCleanEntry } from "../core/builder/cleanEntryBuilder";
import { CleanEntryError } from "../errors/CleanEntryError";

export interface CleanEntryMiddlewareOptions extends CleanEntryOptions {
  /**
   * If true, the middleware will throw on invalid/blocked payloads instead of
   * sending a 400 response directly.
   */
  throwOnError?: boolean;
}

export function cleanEntryMiddleware(options: CleanEntryMiddlewareOptions = {}) {
  const { throwOnError, ...instanceOptions } = options;
  const instance = createCleanEntry(instanceOptions);

  return function cleanEntry(req: Request, res: Response, next: NextFunction) {
    const originalBody = req.body;

    const guardResult = instance.guard(originalBody);
    if (!guardResult.valid) {
      const message = "Request body failed validation";
      const error = new CleanEntryError("INVALID_PAYLOAD", message, guardResult.errors);

      if (throwOnError) {
        return next(error);
      }

      return res.status(400).json({
        error: "invalid_payload",
        message,
        details: guardResult.errors
      });
    }

    const { cleaned } = instance.scrub(originalBody);
    // Mutate body to cleaned version
    (req as any).body = cleaned;

    return next();
  };
}


import type { GuardOptions, GuardResult } from "../../config/types";
import { runGuard } from "./schemaValidator";
import { isSpamLike } from "./spamDetector";
import { isPlainObject } from "../../utils/normalize";

export function createGuard(options: GuardOptions = {}) {
  return {
    guard<T = unknown>(value: T): GuardResult {
      const baseResult = runGuard(value, options);
      if (!baseResult.valid) return baseResult;

      const errors: string[] = [];

      // Simple spam detection: check string values in the payload
      if (options.spamDetection?.enabled) {
        if (typeof value === "string" && isSpamLike(value, options.spamDetection)) {
          errors.push("Payload looks like spam/keyboard smashing");
        } else if (isPlainObject(value)) {
          for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
            if (typeof v === "string" && isSpamLike(v, options.spamDetection)) {
              errors.push(`${key}: looks like spam/keyboard smashing`);
            }
          }
        }
      }

      return {
        valid: errors.length === 0,
        errors
      };
    }
  };
}


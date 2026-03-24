import type { GuardOptions } from "../../config/types";
import { isString } from "../../utils/normalize";

function hasKeyboardSmashPattern(value: string, maxRun: number): boolean {
  // Detect long runs of consonants (e.g., "asdfghjkl" like patterns)
  const consonantRun = /[bcdfghjklmnpqrstvwxyz]{6,}/i;
  const limitPattern = new RegExp(`[bcdfghjklmnpqrstvwxyz]{${maxRun},}`, "i");
  return consonantRun.test(value) || limitPattern.test(value);
}

export function isSpamLike(value: unknown, options?: GuardOptions["spamDetection"]): boolean {
  if (!options?.enabled) return false;
  if (!isString(value)) return false;

  const maxRun = options.maxConsonantRun ?? 6;
  return hasKeyboardSmashPattern(value, maxRun);
}


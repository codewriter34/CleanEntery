import { normalizeWhitespace, isString, isPlainObject } from "../../utils/normalize";
import { scriptTagPattern, htmlTagPattern, sqlKeywords } from "../../utils/patterns";
import type { ScrubberOptions } from "../../config/types";

export function scrubString(value: string, options: ScrubberOptions = {}): string {
  let result = value;

  if (options.trimWhitespace !== false) {
    result = normalizeWhitespace(result);
  }

  if (options.enableXssSanitization !== false) {
    // Remove script tags entirely
    result = result.replace(scriptTagPattern, "");
  }

  if (options.enableSqlSanitization) {
    // Very conservative: remove standalone SQL keywords
    const parts = result.split(/\b/);
    result = parts
      .filter((part) => !sqlKeywords.includes(part.toLowerCase()))
      .join("");
  }

  return result;
}

export function scrubValue(value: unknown, options: ScrubberOptions = {}): unknown {
  if (isString(value)) {
    return scrubString(value, options);
  }

  if (Array.isArray(value)) {
    return value.map((item) => scrubValue(item, options));
  }

  if (isPlainObject(value)) {
    const obj = value as Record<string, unknown>;
    const cleaned: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(obj)) {
      cleaned[key] = scrubValue(v, options);
    }
    return cleaned;
  }

  return value;
}


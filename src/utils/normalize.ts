export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}


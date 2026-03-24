// Very lightweight patterns for common SQL injection and XSS vectors.

export const sqlKeywords = [
  "select",
  "insert",
  "update",
  "delete",
  "drop",
  "truncate",
  "alter",
  "union",
  "--",
  ";"
];

export const scriptTagPattern = /<\s*script[^>]*>([\s\S]*?)<\s*\/\s*script\s*>/gi;

export const htmlTagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

export function hasSuspiciousSql(value: string): boolean {
  const lower = value.toLowerCase();
  return sqlKeywords.some((kw) => lower.includes(kw));
}


export type CleanEntryErrorCode = "INVALID_PAYLOAD" | "SPAM_DETECTED";

export class CleanEntryError extends Error {
  public readonly code: CleanEntryErrorCode;
  public readonly details?: unknown;

  constructor(code: CleanEntryErrorCode, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "CleanEntryError";
  }
}


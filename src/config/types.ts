export type Primitive = string | number | boolean | null | undefined;

export type FieldType = "string" | "number" | "boolean" | "email" | "any";

export interface FieldSchema {
  type: FieldType;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export type SchemaDefinition = Record<string, FieldSchema>;

export interface ScrubberOptions {
  enableSqlSanitization?: boolean;
  enableXssSanitization?: boolean;
  trimWhitespace?: boolean;
}

export interface GuardOptions {
  spamDetection?: {
    enabled?: boolean;
    maxConsonantRun?: number;
  };
  schema?: SchemaDefinition;
}

export interface CleanEntryOptions {
  scrubber?: ScrubberOptions;
  guard?: GuardOptions;
}

export interface GuardResult {
  valid: boolean;
  errors: string[];
}

export interface ScrubResult<T = unknown> {
  cleaned: T;
}

export interface CleanEntryInstance {
  scrub<T = unknown>(value: T): ScrubResult<T>;
  guard<T = unknown>(value: T): GuardResult;
}

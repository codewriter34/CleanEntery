import type { GuardOptions, GuardResult, SchemaDefinition } from "../../config/types";
import { isPlainObject } from "../../utils/normalize";
import { validatePrimitive } from "./validators";

export function validateAgainstSchema(
  value: unknown,
  schema: SchemaDefinition | undefined
): GuardResult {
  if (!schema) {
    return { valid: true, errors: [] };
  }

  if (!isPlainObject(value)) {
    return {
      valid: false,
      errors: ["Expected an object for schema validation"]
    };
  }

  const obj = value as Record<string, unknown>;
  const errors: string[] = [];

  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const fieldValue = obj[fieldName];
    const error = validatePrimitive(fieldValue, fieldSchema);
    if (error) {
      errors.push(`${fieldName}: ${error}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function runGuard(value: unknown, options: GuardOptions = {}): GuardResult {
  const schemaResult = validateAgainstSchema(value, options.schema);

  if (!schemaResult.valid) {
    return schemaResult;
  }

  // For now, spam detection is only run on top-level string payloads or fields
  // Users can configure this further later.

  return schemaResult;
}


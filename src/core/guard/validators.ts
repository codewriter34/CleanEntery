import validator from "validator";
import type { FieldSchema } from "../../config/types";

export function validatePrimitive(value: unknown, schema: FieldSchema): string | null {
  const { type, minLength, maxLength, min, max } = schema;

  if (value == null) {
    if (schema.required) {
      return "Value is required";
    }
    return null;
  }

  switch (type) {
    case "string": {
      if (typeof value !== "string") return "Expected string";
      if (minLength != null && value.length < minLength) {
        return `Expected length >= ${minLength}`;
      }
      if (maxLength != null && value.length > maxLength) {
        return `Expected length <= ${maxLength}`;
      }
      return null;
    }
    case "email": {
      if (typeof value !== "string") return "Expected string (email)";
      if (!validator.isEmail(value)) return "Invalid email";
      return null;
    }
    case "number": {
      if (typeof value !== "number") return "Expected number";
      if (min != null && value < min) return `Expected >= ${min}`;
      if (max != null && value > max) return `Expected <= ${max}`;
      return null;
    }
    case "boolean": {
      if (typeof value !== "boolean") return "Expected boolean";
      return null;
    }
    case "any":
    default:
      return null;
  }
}


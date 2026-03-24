import type { ScrubberOptions, ScrubResult } from "../../config/types";
import { scrubValue } from "./rules";

export function createScrubber(options: ScrubberOptions = {}) {
  return {
    scrub<T = unknown>(value: T): ScrubResult<T> {
      const cleaned = scrubValue(value, options) as T;
      return { cleaned };
    }
  };
}


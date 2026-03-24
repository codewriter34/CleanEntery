import type {
  CleanEntryInstance,
  CleanEntryOptions,
  GuardOptions,
  ScrubberOptions
} from "../../config/types";
import { createScrubber } from "../scrubber";
import { createGuard } from "../guard";

export class CleanEntryBuilder {
  private scrubberOptions: ScrubberOptions = {
    enableSqlSanitization: true,
    enableXssSanitization: true,
    trimWhitespace: true
  };

  private guardOptions: GuardOptions = {
    spamDetection: { enabled: true },
    schema: undefined
  };

  withScrubber(options: ScrubberOptions): this {
    this.scrubberOptions = { ...this.scrubberOptions, ...options };
    return this;
  }

  withGuard(options: GuardOptions): this {
    this.guardOptions = {
      ...this.guardOptions,
      ...options,
      spamDetection: {
        ...this.guardOptions.spamDetection,
        ...options.spamDetection
      }
    };
    return this;
  }

  configure(options: CleanEntryOptions): this {
    if (options.scrubber) this.withScrubber(options.scrubber);
    if (options.guard) this.withGuard(options.guard);
    return this;
  }

  build(): CleanEntryInstance {
    const scrubber = createScrubber(this.scrubberOptions);
    const guard = createGuard(this.guardOptions);

    return {
      scrub: scrubber.scrub,
      guard: guard.guard
    };
  }
}

export function createCleanEntry(options?: CleanEntryOptions): CleanEntryInstance {
  const builder = new CleanEntryBuilder();
  if (options) {
    builder.configure(options);
  }
  return builder.build();
}


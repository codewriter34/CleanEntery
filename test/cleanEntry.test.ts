import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CleanEntryBuilder, createCleanEntry } from "../src/index";

describe("createCleanEntry", () => {
  it("scrubs script tags from strings", () => {
    const ce = createCleanEntry();
    const { cleaned } = ce.scrub('<p>hi</p><script>alert(1)</script>');
    assert.equal(cleaned, "<p>hi</p>");
  });

  it("recursively scrubs nested objects", () => {
    const ce = createCleanEntry();
    const { cleaned } = ce.scrub({
      name: "  Jane  ",
      meta: { note: "<script>x</script>ok" }
    });
    assert.deepEqual(cleaned, {
      name: "Jane",
      meta: { note: "ok" }
    });
  });

  it("passes guard when no schema and payload is plain", () => {
    const ce = createCleanEntry();
    const r = ce.guard({ foo: "bar" });
    assert.equal(r.valid, true);
    assert.deepEqual(r.errors, []);
  });

  it("fails guard when schema requires a missing field", () => {
    const ce = createCleanEntry({
      guard: {
        schema: {
          email: { type: "email", required: true }
        }
      }
    });
    const r = ce.guard({});
    assert.equal(r.valid, false);
    assert.ok(r.errors.some((e) => e.includes("email")));
  });

  it("validates email fields", () => {
    const ce = createCleanEntry({
      guard: {
        schema: {
          email: { type: "email", required: true }
        }
      }
    });
    assert.equal(ce.guard({ email: "not-an-email" }).valid, false);
    assert.equal(ce.guard({ email: "a@b.co" }).valid, true);
  });

  it("flags spam-like strings when spam detection is on", () => {
    const ce = createCleanEntry({
      guard: { spamDetection: { enabled: true } }
    });
    const smash = "bcdfgjklm"; // long consonant run
    const r = ce.guard({ note: smash });
    assert.equal(r.valid, false);
    assert.ok(r.errors.some((e) => e.includes("spam")));
  });

  it("skips spam check when disabled", () => {
    const ce = createCleanEntry({
      guard: { spamDetection: { enabled: false } }
    });
    const r = ce.guard({ note: "bcdfgjklm" });
    assert.equal(r.valid, true);
  });
});

describe("CleanEntryBuilder", () => {
  it("merges partial spam options without turning spam detection off", () => {
    const instance = new CleanEntryBuilder()
      .withGuard({ spamDetection: { enabled: true, maxConsonantRun: 20 } })
      .withGuard({ spamDetection: { maxConsonantRun: 8 } })
      .build();

    const r = instance.guard({ x: "bcdfgjklm" });
    assert.equal(r.valid, false);
  });

  it("configure applies scrubber and guard together", () => {
    const instance = new CleanEntryBuilder()
      .configure({
        scrubber: { trimWhitespace: false },
        guard: {
          schema: { name: { type: "string", required: true, minLength: 2 } }
        }
      })
      .build();

    const { cleaned } = instance.scrub({ name: "  ab  " });
    assert.equal((cleaned as { name: string }).name, "  ab  ");
    assert.equal(instance.guard({ name: "a" }).valid, false);
  });
});

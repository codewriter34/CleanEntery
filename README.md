# clean-entry

Lightweight **Express** middleware and utilities to **validate**, **detect spam-like input**, and **scrub** request bodies (whitespace, basic XSS/script patterns, optional SQL-keyword stripping).

Installing the package does nothing by itself—you wire `cleanEntryMiddleware` or `createCleanEntry()` in your app.

## Install

```bash
npm i clean-entry
```

Peer dependency: **Express** 4+ (for the middleware).

```bash
npm i express clean-entry
```

## Express: protect JSON bodies

Use a body parser first, then this middleware so `req.body` exists.

```ts
import express from "express";
import { cleanEntryMiddleware } from "clean-entry";

const app = express();
app.use(express.json());

app.use(
  cleanEntryMiddleware({
    guard: {
      schema: {
        email: { type: "email", required: true },
        message: { type: "string", required: true, maxLength: 5000 }
      }
      // Spam-style detection is on by default; see options below.
    }
  })
);

app.post("/contact", (req, res) => {
  // Body passed guard + scrub
  res.json({ ok: true });
});
```

### Validation errors

By default, invalid payloads get **400** with JSON like:

```json
{
  "error": "invalid_payload",
  "message": "Request body failed validation",
  "details": ["email: …", "…"]
}
```

Set `throwOnError: true` to pass a `CleanEntryError` to Express error handling instead.

## Without Express

```ts
import { createCleanEntry } from "clean-entry";

const ce = createCleanEntry({
  guard: {
    schema: { name: { type: "string", required: true, minLength: 2 } }
  }
});

const check = ce.guard({ name: "  x  " });
if (!check.valid) {
  console.error(check.errors);
}

const { cleaned } = ce.scrub({ name: "  hello  " });
```

## Options (overview)

| Area | What it does |
|------|----------------|
| **guard.schema** | Per-field types: `string`, `number`, `boolean`, `email`, `any`; optional `required`, lengths, min/max. |
| **guard.spamDetection** | Heuristic “keyboard smash” / long consonant runs on string values. **Enabled by default.** Set `{ enabled: false }` to turn off. |
| **scrubber** | Trim/normalize whitespace; strip script-tag blocks; optional SQL-keyword stripping. Defaults lean toward sanitization on. |

Use `CleanEntryBuilder` for a fluent setup: `.withGuard()`, `.withScrubber()`, `.configure()`, then `.build()`.

## Requirements

- Node.js **16+**

## License

MIT

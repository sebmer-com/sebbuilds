# Seb Builds contributor rules

## Public build logs

Build logs are date-only public content. This is a repository invariant, not a styling preference:

- Use `date` in `YYYY-MM-DD` form; do not add a `time` property to log JSON.
- Never show or emit a build-log time in the UI, static JSON, LLM context, CLI output, RSS, or any other public surface.
- If multiple logs have the same date, choose their order manually in `public/content/logs/index.json`. Do not introduce hidden chronological metadata.

## Content safety

Keep the public site free of credentials, private paths, client-private data, operational internals, and financial/trading recommendations. Describe capabilities and outcomes in plain language instead.

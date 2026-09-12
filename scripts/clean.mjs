import { rm } from "node:fs/promises";

// Always build from an empty output so deleted posts and new drafts cannot
// survive as stale HTML from a previous production build.
await rm(new URL("../dist/", import.meta.url), { recursive: true, force: true });

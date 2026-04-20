#!/usr/bin/env node

import { runCli } from "./cli/cli-handler";

/**
 * Entrypoint — Minimalist wrapper that delegates to the specialized CLI handler.
 */
runCli().catch((err) => {
  console.error("Fatal exception during CLI execution:", err);
  process.exit(1);
});

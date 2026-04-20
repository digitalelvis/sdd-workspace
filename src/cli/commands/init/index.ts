import { Command } from "commander";
import { initAction } from "./action";

/**
 * Factory for the 'init' command definition.
 */
export function makeInitCommand(program: Command): void {
  program
    .command("init")
    .description("Initialize the SDD workspace in the current directory")
    .option("-i, --ide <name>", "Setup specific IDE ecosystem (e.g. vscode, cursor, windsurf)")
    .option("-a, --agents <list>", "Comma-separated list of AI agents (e.g. antigravity,cursor)")
    .option("--no-lint", "Skip automated Linter and Prettier injection")
    .action(initAction);
}

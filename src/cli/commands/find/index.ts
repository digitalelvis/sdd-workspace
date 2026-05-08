import { Command } from "commander";
import { findAction } from "./action";

/**
 * Factory for the unified 'find' command.
 * Use -s to search skills, -r to search rules.
 */
export function makeFindCommand(program: Command): void {
  program
    .command("find [searchTerm]")
    .description("Search the registry for skills or rules")
    .option("-s, --skills", "Search skills")
    .option("-r, --rules", "Search rules")
    .option("-p, --provider <name>", "Filter by provider (e.g., sdd, community)")
    .option("-c, --category <name>", "Filter by category (e.g., architecture, frontend)")
    .option("-n, --name <name>", "Filter by exact or partial resource name")
    .action(findAction);
}

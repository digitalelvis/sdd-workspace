import { Command } from "commander";
import { findSkillsAction } from "./action";

/**
 * Factory for the 'find-skills' command definition.
 */
export function makeFindSkillsCommand(program: Command): void {
  program
    .command("find-skills [searchTerm]")
    .description("Search the registry for available AI skills")
    .option("-p, --provider <name>", "Filter by provider (e.g., sdd, community)")
    .option("-c, --category <name>", "Filter by category (e.g., architecture, frontend)")
    .option("-n, --name <name>", "Filter by exact or partial skill name")
    .action(findSkillsAction);
}

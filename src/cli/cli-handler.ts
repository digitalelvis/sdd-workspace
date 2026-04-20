import { Command } from "commander";
import { registerCommands } from "./commands";

/**
 * CLI Handler — Configures the global program settings and registers commands.
 * This abstracts the Commander setup from the entrypoint.
 */
export async function runCli(): Promise<void> {
  const program = new Command();

  program
    .name("sdd")
    .description("AI-SDD Workspace: Scaffolds an AI-friendly Spec-Driven Development ecosystem")
    .version("0.0.2"); // Sync with package.json manually or via automation

  // Register all modular commands
  registerCommands(program);

  // Parse arguments and execute actions
  program.parse(process.argv);

  // Fallback to help if no arguments provided
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

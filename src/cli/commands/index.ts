import { Command } from "commander";
import { makeInitCommand } from "./init";
import { makeApplyCommand } from "./apply";
import { makeConfigCommand } from "./config";

/**
 * Registry to load and initialize all modular commands.
 */
export function registerCommands(program: Command): void {
  makeInitCommand(program);
  makeApplyCommand(program);
  makeConfigCommand(program);
}

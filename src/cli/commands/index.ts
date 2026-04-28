import { Command } from "commander";
import { makeInitCommand } from "./init";
import { makeConfigCommand } from "./config";
import { makeApplyCommand } from "./apply";
import { makeFindSkillsCommand } from "./find-skills";

export function registerCommands(program: Command): void {
  makeInitCommand(program);
  makeConfigCommand(program);
  makeApplyCommand(program);
  makeFindSkillsCommand(program);
}

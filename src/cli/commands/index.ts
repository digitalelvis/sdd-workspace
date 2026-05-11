import { Command } from "commander";
import { makeInitCommand } from "./init";
import { makeConfigCommand } from "./config";
import { makeApplyCommand } from "./apply";
import { makeFindCommand } from "./find";
import { makeDoctorCommand } from "./doctor";

export function registerCommands(program: Command): void {
  makeInitCommand(program);
  makeConfigCommand(program);
  makeApplyCommand(program);
  makeFindCommand(program);
  makeDoctorCommand(program);
}

import { Command } from "commander";
import { doctorAction } from "./action";

export function makeDoctorCommand(program: Command): void {
  program
    .command("doctor")
    .description(
      "Read-only check: resolved sdd.yml vs .agents (skills and rules)",
    )
    .option(
      "-C, --cwd <dir>",
      "Project directory (default: current working directory)",
    )
    .action(doctorAction);
}

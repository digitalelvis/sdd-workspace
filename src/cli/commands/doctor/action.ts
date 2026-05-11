import chalk from "chalk";
import path from "path";
import { Doctor } from "../../../analyzer/Doctor";

function printLine(level: "ok" | "warn" | "error", message: string): void {
  if (level === "ok") {
    console.log(chalk.green(`  ✔ ${message}`));
  } else if (level === "warn") {
    console.log(chalk.yellow(`  ⚠ ${message}`));
  } else {
    console.log(chalk.red(`  ✖ ${message}`));
  }
}

/**
 * Read-only validation of sdd.yml vs .agents layout.
 */
export function doctorAction(options: { cwd?: string }): void {
  const targetDir = options.cwd ? path.resolve(options.cwd) : process.cwd();

  console.log(chalk.blue.bold("\n🩺 SDD doctor\n"));
  console.log(chalk.gray(`  Working directory: ${targetDir}\n`));

  const result = Doctor.run(targetDir);
  for (const line of result.lines) {
    printLine(line.level, line.message);
  }

  console.log("");
  if (result.exitCode === 0) {
    console.log(chalk.green.bold("Done — no blocking issues detected.\n"));
  } else {
    console.log(
      chalk.red.bold("Done — fix errors above (often: run `sdd apply`).\n"),
    );
  }

  process.exit(result.exitCode);
}

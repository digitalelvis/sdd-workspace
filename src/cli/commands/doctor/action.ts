import path from "path";
import { Doctor } from "../../../analyzer/Doctor";
import { TerminalUi } from "../../../ui";
import pkg from "../../../../package.json";

/**
 * Read-only validation of sdd.yml vs .agents layout.
 */
export function doctorAction(options: { cwd?: string }): void {
  const targetDir = options.cwd ? path.resolve(options.cwd) : process.cwd();

  TerminalUi.printBanner({
    headline: "SDD DOCTOR",
    version: pkg.version,
    tagline: "Read-only workspace health checks",
  });
  TerminalUi.infoLine(`Working directory: ${targetDir}`);
  TerminalUi.divider();

  const result = Doctor.run(targetDir);
  TerminalUi.section("Validation report");
  for (const line of result.lines) {
    if (line.level === "ok") {
      TerminalUi.successLine(line.message);
    } else if (line.level === "warn") {
      TerminalUi.warnLine(line.message);
    } else {
      TerminalUi.errorLine(line.message);
    }
  }

  if (result.exitCode === 0) {
    TerminalUi.footerHints([
      {
        key: "sdd apply",
        text: "re-sync workspace resources",
        variant: "success",
      },
      { key: "sdd init", text: "bootstrap missing files", variant: "default" },
    ]);
    TerminalUi.doneOk("Done — no blocking issues detected.");
  } else {
    TerminalUi.footerHints([
      { key: "sdd apply", text: "fix missing resources", variant: "warn" },
      { key: "sdd init", text: "re-bootstrap if needed", variant: "default" },
    ]);
    TerminalUi.doneError("Done — fix errors above (often: run `sdd apply`).");
  }

  process.exit(result.exitCode);
}

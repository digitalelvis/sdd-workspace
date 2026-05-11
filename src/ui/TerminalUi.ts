import { TerminalTheme } from "./TerminalTheme";
import { isInteractiveTerminal } from "./terminalCapabilities";
import figlet from "figlet";

const theme = new TerminalTheme();

const BOX_WIDTH = 110;
const BOX_TOP =
  "══════════════════════════════════════════════════════════════════════════════════════════════════════════════";
const BOX_BOT =
  "══════════════════════════════════════════════════════════════════════════════════════════════════════════════";
const BOX_SIDE = "║";

function boxLine(inner: string): string {
  const pad = Math.max(0, BOX_WIDTH - inner.length);
  return `${BOX_SIDE} ${inner}${" ".repeat(pad)}${BOX_SIDE}`;
}

export class TerminalUi {
  static printBanner(params: {
    headline: string;
    version: string;
    tagline?: string;
  }): void {
    const { headline, version, tagline } = params;

    console.log("");
    const logo = figlet.textSync("SDD Workspace", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
    });

    if (!isInteractiveTerminal()) {
      console.log(theme.primary(logo));
      console.log(theme.primary(headline));
      console.log(theme.muted(`version ${version}`));
      if (tagline) console.log(theme.muted(tagline));
      console.log("");
      return;
    }

    console.log(theme.primary(logo));
    console.log(theme.primary(boxLine(`  ${headline}`)));
    console.log(theme.primary(boxLine("")));
    console.log(theme.muted(boxLine(`  VERSION ${version}`)));
    if (tagline) {
      console.log(theme.muted(boxLine(`  ${tagline}`)));
    }
    console.log(theme.accent(BOX_BOT));
    console.log("");
  }

  static section(title: string): void {
    console.log("");
    console.log(theme.primary(`◆ ${title}`));
    console.log(theme.muted(`  ${"·".repeat(Math.min(title.length + 3, 48))}`));
  }

  static kv(label: string, value: string): void {
    console.log(`${theme.muted(`  ${label}:`)} ${theme.plain(value)}`);
  }

  static tip(text: string): void {
    console.log(theme.accent(`  i ${text}`));
  }

  static infoLine(text: string): void {
    console.log(theme.muted(`  ${text}`));
  }

  static successLine(text: string): void {
    console.log(theme.successDim(`  ✔ ${text}`));
  }

  static warnLine(text: string): void {
    console.log(theme.warning(`  ⚠ ${text}`));
  }

  static errorLine(text: string): void {
    console.log(theme.errorDim(`  ✖ ${text}`));
  }

  static divider(char = "─", count = 72): void {
    console.log(theme.muted(char.repeat(count)));
  }

  static footerHints(
    hints: Array<{
      key: string;
      text: string;
      variant?: "default" | "success" | "warn";
    }>,
  ): void {
    const parts = hints.map((h) => {
      const k =
        h.variant === "success"
          ? theme.keySuccess(h.key)
          : h.variant === "warn"
            ? theme.keyWarn(h.key)
            : theme.key(h.key);
      return `${k} ${theme.muted(h.text)}`;
    });
    console.log("");
    console.log(`  ${parts.join(theme.muted("   ·   "))}`);
    console.log("");
  }

  static doneOk(text: string): void {
    console.log("");
    console.log(theme.success(text));
    console.log("");
  }

  static doneError(text: string): void {
    console.log("");
    console.log(theme.error(text));
    console.log("");
  }
}

/**
 * Terminal capability checks for consistent CLI rendering.
 */
export function isColorDisabled(): boolean {
  return process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== "";
}

export function isInteractiveTerminal(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

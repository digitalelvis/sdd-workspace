/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Types allowed per git-governance.md
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "docs", "chore", "test", "perf"],
    ],
    // Scope must be lowercase (e.g. cli, engine, config)
    "scope-case": [2, "always", "lower-case"],
    // Subject must use imperative mood — disallow sentence/pascal/upper case
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    // Subjects must not end with a period
    "subject-full-stop": [2, "never", "."],
    // Keep subjects concise
    "subject-max-length": [2, "always", 100],
    // Body and footer lines can be longer (URLs, etc.)
    "body-max-line-length": [1, "always", 120],
  },
};

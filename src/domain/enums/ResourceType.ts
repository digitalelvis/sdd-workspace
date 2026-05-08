/**
 * ResourceType — discriminates between the two searchable resource kinds
 * in the registry catalog. Used by ResourceSearchService and the `find` command.
 */
export enum ResourceType {
  SKILL = "skill",
  RULE = "rule",
}

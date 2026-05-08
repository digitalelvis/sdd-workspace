import chalk from "chalk";
import { RegistryLoader } from "../../../resources/RegistryLoader";
import { ResourceSearchService } from "../../../resources/ResourceSearchService";
import { ResourceType } from "../../../domain/enums/ResourceType";

export interface FindOptions {
  skills?: boolean;
  rules?: boolean;
  provider?: string;
  category?: string;
  name?: string;
}

export async function findAction(
  searchTerm: string | undefined,
  options: FindOptions,
): Promise<void> {
  const resourceType = resolveResourceType(options);

  if (!resourceType) {
    console.error(
      chalk.red("❌ You must specify a resource type: use -s (skills) or -r (rules)."),
    );
    process.exit(1);
  }

  const registry = RegistryLoader.load();
  const service = new ResourceSearchService(registry);

  const results = service.find({
    type: resourceType,
    searchTerm,
    provider: options.provider,
    category: options.category,
    name: options.name,
  });

  if (results.length === 0) {
    console.log(chalk.yellow("⚠️  No resources found matching the criteria."));
    return;
  }

  const label = resourceType === ResourceType.SKILL ? "skill(s)" : "rule(s)";
  console.log(chalk.green(`✅ Found ${results.length} ${label}:`));

  for (const { id, definition: def } of results) {
    const icon = resourceType === ResourceType.SKILL ? "🔹" : "📋";
    console.log(chalk.cyan(`\n${icon} ${id}`));
    if (def.provider) console.log(`   Provider:   ${chalk.white(def.provider)}`);
    if (def.categories?.length) {
      console.log(`   Categories: ${chalk.white(def.categories.join(", "))}`);
    }
    if (def.mode) console.log(`   Mode:       ${chalk.white(def.mode)}`);
  }

  console.log();
}

function resolveResourceType(options: FindOptions): ResourceType | null {
  if (options.skills) return ResourceType.SKILL;
  if (options.rules) return ResourceType.RULE;
  return null;
}

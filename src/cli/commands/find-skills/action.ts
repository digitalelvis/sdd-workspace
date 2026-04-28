import chalk from "chalk";
import { SkillService } from "../../../resources/SkillService";
import { RegistryLoader } from "../../../resources/RegistryLoader";

interface FindSkillsOptions {
  provider?: string;
  category?: string;
  name?: string;
}

export async function findSkillsAction(searchTerm: string | undefined, options: FindSkillsOptions): Promise<void> {
  const registry = RegistryLoader.load();
  const skillService = new SkillService(registry);

  const query = {
    searchTerm,
    provider: options.provider,
    category: options.category,
    name: options.name,
  };

  const results = skillService.findSkills(query);

  if (results.length === 0) {
    console.log(chalk.yellow("⚠️  No skills found matching the criteria."));
    return;
  }

  console.log(chalk.green(`✅ Found ${results.length} skill(s):`));
  results.forEach(id => {
    const def = registry.skills[id];
    console.log(chalk.cyan(`\n🔹 ${id}`));
    if (def.provider) console.log(`   Provider: ${chalk.white(def.provider)}`);
    if (def.categories && def.categories.length > 0) console.log(`   Categories: ${chalk.white(def.categories.join(", "))}`);
  });
  console.log();
}

import { StackProvider, SetupOptions } from "../../domain/contracts/StackProvider";
import { IdeProvider } from "../../domain/contracts/IdeProvider";
import { IdeEnvironment } from "../../domain/enums/IdeEnvironment";

// Mapping Ide providers locally as factory for now
import { CursorIdeProvider } from "../providers/ides/CursorIdeProvider";
import { VSCodeIdeProvider } from "../providers/ides/VSCodeIdeProvider";
import { WindsurfIdeProvider } from "../providers/ides/WindsurfIdeProvider";
import { AntigravityIdeProvider } from "../providers/ides/AntigravityIdeProvider";

export class EcosystemEngine {
  public setup(targetDir: string, stackProviders: StackProvider[], selectedIde: string | undefined, options: SetupOptions): void {
    
    // 1. Run Stack Providers
    for (const stackProvider of stackProviders) {
      stackProvider.setupEcosystem(targetDir, options);
    }

    // 2. Map and run local Ide Configs
    if (selectedIde) {
       const ideProvider = this.getIdeProvider(selectedIde);
       if (ideProvider) {
         ideProvider.setupIdeConfig(targetDir, options);
       }
    }
  }

  private getIdeProvider(ideName: string): IdeProvider | null {
    switch(ideName.toLowerCase()) {
      case IdeEnvironment.VSCODE: return new VSCodeIdeProvider();
      case IdeEnvironment.CURSOR: return new CursorIdeProvider();
      case IdeEnvironment.WINDSURF: return new WindsurfIdeProvider();
      case IdeEnvironment.ANTIGRAVITY: return new AntigravityIdeProvider();
      default: return null;
    }
  }
}

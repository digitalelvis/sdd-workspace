import path from "path";

/**
 * ResourcePathUtils — Centralizes the resolution of the resources directory.
 * Works across both dev (src) and production (dist) environments.
 */
export class ResourcePathUtils {
  /**
   * Returns the absolute path to the resources directory.
   */
  public static getResourcesPath(): string {
    // Check if we are running from the dist directory
    const isDist = __dirname.includes("dist");
    
    if (isDist) {
      // From: dist/utils/
      // To:   src/resources/
      // Logic: dist/utils -> dist -> root -> src/resources
      return path.join(__dirname, "..", "..", "src", "resources");
    } else {
      // From: src/utils/
      // To:   src/resources/
      // Logic: src/utils -> src -> resources
      return path.join(__dirname, "..", "resources");
    }
  }
}

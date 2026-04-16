"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFramework = detectFramework;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function detectFramework(targetDir) {
    const packageJsonPath = path_1.default.join(targetDir, 'package.json');
    if (!fs_1.default.existsSync(packageJsonPath)) {
        // If there is no package.json in the current dir, default to nodejs
        return 'nodejs';
    }
    try {
        const pkgContent = fs_1.default.readFileSync(packageJsonPath, 'utf-8');
        const pkg = JSON.parse(pkgContent);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        // Detection priority matters: Next.js implies React, so check Next first.
        if (deps['next']) {
            return 'nextjs';
        }
        // Checking for a pure React/Vite environment
        if (deps['react']) {
            return 'react';
        }
        // Default fallback
        return 'nodejs';
    }
    catch (error) {
        console.warn('⚠️ Could not parse package.json. Defaulting to general Node.js rules.', error);
        return 'nodejs';
    }
}

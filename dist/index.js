#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const framework_detector_1 = require("./analyzer/framework-detector");
const WorkspaceService_1 = require("./scaffolder/WorkspaceService");
const AiAgent_1 = require("./domain/enums/AiAgent");
const IdeEnvironment_1 = require("./domain/enums/IdeEnvironment");
const program = new commander_1.Command();
program
    .name("ai-sdd-workspace")
    .description("AI - SDD Engine for Workspaces: Scaffolds an AI-friendly SDD ecosystem")
    .version("0.0.1");
program
    .command("init")
    .description("Initialize the SDD workspace in the current directory")
    .option("-i, --ide <name>", "Setup specific IDE ecosystem (e.g. vscode, cursor, windsurf)")
    .option("-a, --agents <list>", "Comma-separated list of AI agents to inject SDD rules (e.g. antigravity,copilot,cursor)")
    .option("--no-lint", "Skip automated Linter and Prettier injection")
    .action(async (options) => {
    console.log(chalk_1.default.blue.bold("\n🚀 Welcome to AI - SDD Engine for Workspaces!\n"));
    console.log(chalk_1.default.cyan("Starting the initialization process..."));
    let targetIde = options.ide;
    let targetAgents = [];
    if (options.agents) {
        const agentsList = options.agents.split(",").map((s) => s.trim().toLowerCase());
        for (const a of agentsList) {
            if (Object.values(AiAgent_1.AiAgent).includes(a)) {
                targetAgents.push(a);
            }
            else {
                console.log(chalk_1.default.yellow(`⚠️ Warning: Agent '${a}' is not recognized. Ignoring.`));
            }
        }
    }
    if (!targetIde && targetAgents.length === 0) {
        const answers = await inquirer_1.default.prompt([
            {
                type: "confirm",
                name: "confirmInit",
                message: "Do you want to initialize the SDD structure and AI capabilities in this directory?",
                default: true,
            },
            {
                type: "list",
                name: "ide",
                message: "Which IDE ecosystem do you want to configure?",
                choices: ["none", ...Object.values(IdeEnvironment_1.IdeEnvironment)],
                when: (answers) => answers.confirmInit,
            },
            {
                type: "checkbox",
                name: "selectedAgents",
                message: "Which AI agents are you using? (They will receive SDD rules)",
                choices: Object.values(AiAgent_1.AiAgent),
                when: (answers) => answers.confirmInit,
            },
        ]);
        if (!answers.confirmInit) {
            console.log(chalk_1.default.red("\nInitialization aborted by the user."));
            process.exit(0);
        }
        targetIde = answers.ide === "none" ? undefined : answers.ide;
        targetAgents = answers.selectedAgents || [];
    }
    if (targetAgents.length === 0 && !targetIde) {
        console.log(chalk_1.default.yellow("\nNo IDEs or Agents selected. Only standard folders will be generated."));
    }
    console.log(chalk_1.default.green("\n✅ Proceeding with initialization..."));
    const targetDir = process.cwd();
    const stacks = (0, framework_detector_1.detectFramework)(targetDir);
    console.log(chalk_1.default.yellow(`\n[Analyzer] Detected Stacks: ${chalk_1.default.bold(stacks.join(', '))}`));
    console.log(chalk_1.default.cyan(`[Injector] Sideloading AI engineering rules and SDD framework...\n`));
    const orchestrator = new WorkspaceService_1.WorkspaceService();
    orchestrator.execute(targetDir, stacks, targetIde, targetAgents, {
        skipLint: !options.lint,
    });
    console.log(chalk_1.default.green.bold("\n✨ Workspace successfully prepared for advanced Spec-Driven Development!"));
});
program.parse(process.argv);

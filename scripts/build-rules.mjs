import fs from "node:fs";
import path from "node:path";

// Define source and output paths
const sourceFile = "sources/china-direct.yaml";
const outputDir = "rules";
const outputFile = "rules/china-direct.list";

// Read YAML source file
const raw = fs.readFileSync(sourceFile, "utf8");

// Extract domains from simple YAML lines like "- qq.com"
const domains = raw
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("- "))
  .map((line) => line.replace("- ", "").trim());

// Convert domains to Surge DOMAIN-SUFFIX rules
const rules = domains.map((domain) => `DOMAIN-SUFFIX,${domain}`);

// Create rules directory if it does not exist
fs.mkdirSync(outputDir, { recursive: true });

// Write generated Surge rule set
fs.writeFileSync(outputFile, rules.join("\n") + "\n");

console.log(`Generated ${outputFile}`);
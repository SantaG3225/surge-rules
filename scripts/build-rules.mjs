import fs from "node:fs";
import path from "node:path";

// Define folders
const sourceDir = "sources";
const outputDir = "rules";

// Create rules directory if it does not exist
fs.mkdirSync(outputDir, { recursive: true });

// Read all files in sources/
const files = fs
  .readdirSync(sourceDir)
  .filter((file) => file.endsWith(".yaml"));

// Parse a very simple YAML list section
function readSection(raw, sectionName) {
  const lines = raw.split("\n");
  const result = [];
  let active = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect current section, for example: domainSuffix:
    if (trimmed === `${sectionName}:`) {
      active = true;
      continue;
    }

    // Stop when another section starts
    if (active && trimmed.endsWith(":")) {
      active = false;
      continue;
    }

    // Collect list items under active section
    if (active && trimmed.startsWith("- ")) {
      result.push(trimmed.replace("- ", "").trim());
    }
  }

  return result;
}

// Process every yaml file
for (const file of files) {
  const sourcePath = path.join(sourceDir, file);

  // Convert ai.yaml -> ai.list
  const outputName = file.replace(".yaml", ".list");
  const outputPath = path.join(outputDir, outputName);

  // Read source content
  const raw = fs.readFileSync(sourcePath, "utf8");

  const rules = [];
  
  // Generate DOMAIN rules
  for (const item of readSection(raw, "domain")) {
    rules.push(`DOMAIN,${item}`);
  }
  


  // Generate DOMAIN-SUFFIX rules
  for (const item of readSection(raw, "domainSuffix")) {
    rules.push(`DOMAIN-SUFFIX,${item}`);
  }
  
  // Generate DOMAIN-KEYWORD rules
  for (const item of readSection(raw, "domainKeyword")) {
    rules.push(`DOMAIN-KEYWORD,${item}`);
  }


  // Generate IP-CIDR rules
  for (const item of readSection(raw, "ipCidr")) {
    rules.push(`IP-CIDR,${item},no-resolve`);
  }

  // Write generated rule file
  fs.writeFileSync(outputPath, rules.join("\n") + "\n");

  console.log(`Generated ${outputPath}`);
}
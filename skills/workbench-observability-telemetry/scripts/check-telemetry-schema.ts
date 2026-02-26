#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.argv[2];
if (!root) {
  console.error('Usage: check-telemetry-schema.ts <repo-root>');
  process.exit(1);
}

const files = [
  path.join(root, 'apps/support-workbench-web/src/shared/telemetry/telemetryContract.ts'),
  path.join(root, 'packages/telemetry-sdk/src/index.ts')
];

const forbidden = ['email', 'phone', 'address', 'transcript', 'customerMessage', 'rawText'];
let failures = 0;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`Missing telemetry contract file: ${file}`);
    failures++;
    continue;
  }

  const content = fs.readFileSync(file, 'utf8');
  for (const bad of forbidden) {
    if (content.includes(bad)) {
      console.error(`Forbidden telemetry field detected (${bad}) in ${file}`);
      failures++;
    }
  }

  if (!content.includes('piiSafe')) {
    console.error(`Missing piiSafe contract in ${file}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`Telemetry schema check failed with ${failures} issue(s)`);
  process.exit(2);
}

console.log('Telemetry schema check passed');

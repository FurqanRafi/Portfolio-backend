const fs = require('node:fs');
const path = require('node:path');

const requiredFiles = [
  'dist/src/main.js',
  'dist/src/app.module.js',
  'dist/src/generated/prisma/index.js',
  'dist/prisma/seed.js',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(process.cwd(), file)),
);

if (missing.length > 0) {
  console.error('[build:verify] Missing required build files:');
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  console.error(
    '[build:verify] Run yarn build again and make sure Nest compiled the full src directory.',
  );
  process.exit(1);
}

console.log('[build:verify] Build output is complete.');

const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const requiredFiles = [
  'dist/src/main.js',
  'dist/src/app.module.js',
  'dist/src/generated/prisma/index.js',
  'dist/prisma/seed.js',
];

function assertBuildOutput() {
  const missing = requiredFiles.filter(
    (file) => !fs.existsSync(path.join(process.cwd(), file)),
  );

  if (missing.length > 0) {
    console.error('[railway:start] Build output is incomplete. Missing:');
    for (const file of missing) {
      console.error(`- ${file}`);
    }
    console.error(
      '[railway:start] Railway should run yarn build before this command. Check build logs.',
    );
    process.exit(1);
  }
}

function run(command, args) {
  console.log(`[railway:start] ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

assertBuildOutput();
run('prisma', ['migrate', 'deploy']);
run('node', ['dist/prisma/seed.js']);
assertBuildOutput();

console.log('[railway:start] Starting Nest server...');
const server = spawn('node', ['dist/src/main.js'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

server.on('exit', (code) => {
  process.exit(code ?? 0);
});

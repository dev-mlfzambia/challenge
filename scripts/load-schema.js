/**
 * Load core_banking.sql into the database using psql.
 * Uses .env for connection (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME).
 * Run from project root: node scripts/load-schema.js
 */
const fs = require('fs');
const { join } = require('path');
const { spawn } = require('child_process');
const { readFileSync, existsSync } = fs;

const projectRoot = join(__dirname, '..');

// Load .env
const envPath = join(projectRoot, '.env');
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    });
}

const host = process.env.DB_HOST === 'Development' ? 'localhost' : (process.env.DB_HOST || 'localhost');
const port = process.env.DB_PORT || '5432';
const user = process.env.DB_USERNAME || 'postgres';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'core_banking';
const sqlFile = join(projectRoot, 'core_banking.sql');

if (!existsSync(sqlFile)) {
  console.error('Not found: core_banking.sql (run from project root)');
  process.exit(1);
}

function findPsql() {
  if (process.platform === 'win32') {
    const base = 'C:\\Program Files\\PostgreSQL';
    if (existsSync(base)) {
      const versions = fs.readdirSync(base);
      for (const v of versions.sort().reverse()) {
        const exe = join(base, v, 'bin', 'psql.exe');
        if (existsSync(exe)) return exe;
      }
    }
  }
  return 'psql';
}

const psqlExe = findPsql();
process.env.PGPASSWORD = password;

const child = spawn(psqlExe, ['-h', host, '-p', port, '-U', user, '-d', database, '-f', sqlFile], {
  stdio: 'inherit',
  cwd: projectRoot,
  env: { ...process.env, PGPASSWORD: password },
});

child.on('close', (code) => {
  if (process.env.PGPASSWORD) process.env.PGPASSWORD = '';
  process.exit(code ?? 0);
});

child.on('error', (err) => {
  console.error('Failed to run psql:', err.message);
  if (process.platform === 'win32' && psqlExe === 'psql') {
    console.error('On Windows, add PostgreSQL bin to PATH, e.g.:');
    console.error('  setx PATH "%PATH%;C:\\Program Files\\PostgreSQL\\18\\bin"');
  }
  process.exit(1);
});

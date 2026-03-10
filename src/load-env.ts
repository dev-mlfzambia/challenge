import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function loadEnvFile(filePath: string): void {
  if (existsSync(filePath)) {
    readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .forEach((line) => {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) process.env[m[1].trim()] = m[2].trim();
      });
  }
}

// Try project root from cwd, then from this file (covers running from dist/)
loadEnvFile(join(process.cwd(), '.env'));
loadEnvFile(join(__dirname, '..', '.env'));

#!/usr/bin/env node
/**
 * Bundle Secret Scanner
 *
 * Scans the Vite build output (dist/) for known secret patterns.
 * Run automatically before deploy to ensure no API keys, tokens,
 * or private keys leak into the client bundle.
 *
 * Exit code 0 = clean, 1 = secrets detected.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST_DIR = 'dist';

// Patterns that should NEVER appear in a client bundle.
// Server-only keys (Stripe secret, Firebase admin, Resend, Supabase service, OpenRouter)
// must remain on the server.
const PATTERNS = [
  { name: 'Stripe Secret Key', regex: /sk_(?:live|test)_[A-Za-z0-9]{16,}/g, severity: 'CRITICAL' },
  { name: 'Stripe Webhook Secret', regex: /whsec_[A-Za-z0-9_]{16,}/g, severity: 'CRITICAL' },
  { name: 'Resend API Key', regex: /re_[A-Za-z0-9]{16,}/g, severity: 'CRITICAL' },
  { name: 'Supabase Service Role Key', regex: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{20,}/g, severity: 'HIGH' },
  { name: 'Firebase Private Key', regex: /-----BEGIN PRIVATE KEY-----/g, severity: 'CRITICAL' },
  { name: 'Firebase Service Account JSON', regex: /"private_key":\s*"-----BEGIN/g, severity: 'CRITICAL' },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g, severity: 'CRITICAL' },
  { name: 'OpenAI / Anthropic Key', regex: /sk-(?:proj-)?[A-Za-z0-9]{20,}/g, severity: 'HIGH' },
  { name: 'OpenRouter Key', regex: /sk-or-v1-[A-Za-z0-9]{20,}/g, severity: 'HIGH' },
  { name: 'GitHub Personal Access Token', regex: /ghp_[A-Za-z0-9]{30,}/g, severity: 'CRITICAL' },
  { name: 'Generic Bearer Token in env', regex: /Bearer\s+[A-Za-z0-9_\-]{30,}/g, severity: 'LOW' },
];

// Patterns that ARE allowed (public keys, IDs)
const ALLOWLIST = [
  /pk_(?:test|live)_[A-Za-z0-9]{16,}/g, // Stripe publishable
  /AIza[A-Za-z0-9_-]{30,}/g,             // Firebase public API key
  /VITE_[A-Z_]+/g,                        // Vite env references (literal)
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function isAllowedInFile(content, match) {
  // Suppress if the match is part of an allowlisted public pattern
  for (const allow of ALLOWLIST) {
    if (allow.test(match)) return true;
  }
  return false;
}

async function scanFile(path) {
  const ext = extname(path);
  if (!['.js', '.css', '.html', '.json', '.map'].includes(ext)) return [];

  const content = await readFile(path, 'utf8');
  const findings = [];

  for (const pattern of PATTERNS) {
    // Reset regex state
    pattern.regex.lastIndex = 0;
    let m;
    while ((m = pattern.regex.exec(content)) !== null) {
      if (!isAllowedInFile(content, m[0])) {
        findings.push({
          file: path,
          pattern: pattern.name,
          severity: pattern.severity,
          match: m[0].slice(0, 20) + '…', // truncate
          offset: m.index,
        });
      }
    }
  }
  return findings;
}

async function main() {
  console.log('🔍 Scanning dist/ for leaked secrets…\n');

  try {
    await stat(DIST_DIR);
  } catch {
    console.error(`❌ ${DIST_DIR}/ not found. Run \`npm run build\` first.`);
    process.exit(1);
  }

  const files = await walk(DIST_DIR);
  const allFindings = [];

  for (const file of files) {
    const findings = await scanFile(file);
    allFindings.push(...findings);
  }

  if (allFindings.length === 0) {
    console.log(`✅ Clean. Scanned ${files.length} files, no secrets found.\n`);
    process.exit(0);
  }

  console.error(`❌ Found ${allFindings.length} potential secret(s) in bundle:\n`);
  for (const f of allFindings) {
    console.error(`  [${f.severity}] ${f.pattern}`);
    console.error(`    File: ${f.file}`);
    console.error(`    Match: ${f.match}\n`);
  }
  process.exit(1);
}

main().catch((e) => {
  console.error('Scanner crashed:', e);
  process.exit(2);
});

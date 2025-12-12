#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const workspaceRoot = path.resolve(path.dirname(__filename), '..');
const IGNORED_DIRECTORIES = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
]);

function getLatestCanary() {
  const envVersion = process.env.CANARY_VERSION?.trim();
  if (envVersion) {
    return envVersion;
  }

  const output = execSync('npm view sqs-consumer dist-tags --json', {
    encoding: 'utf8',
  }).trim();
  const distTags = JSON.parse(output);
  const canary = distTags.canary;
  if (!canary) {
    throw new Error('Unable to find sqs-consumer canary dist-tag');
  }
  return canary;
}

async function findPackageJsonFiles(startDir) {
  const results = [];

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name === 'package.json') {
        results.push(fullPath);
      }
    }
  }

  await walk(startDir);
  return results;
}

function updateDependencyRecord(record, version) {
  if (!record || typeof record !== 'object') {
    return false;
  }

  if (
    Object.hasOwn(record, 'sqs-consumer') &&
    record['sqs-consumer'] !== version
  ) {
    record['sqs-consumer'] = version;
    return true;
  }

  if (
    Object.hasOwn(record, '@bbc/sqs-consumer') &&
    record['@bbc/sqs-consumer'] !== version
  ) {
    record['@bbc/sqs-consumer'] = version;
    return true;
  }

  return false;
}

async function updatePackages(version) {
  const files = await findPackageJsonFiles(workspaceRoot);
  const changed = [];

  for (const file of files) {
    const json = await readFile(file, 'utf8');
    const pkg = JSON.parse(json);
    let updated = false;

    updated ||= updateDependencyRecord(pkg.dependencies, version);
    updated ||= updateDependencyRecord(pkg.devDependencies, version);
    updated ||= updateDependencyRecord(pkg.peerDependencies, version);

    if (updated) {
      await writeFile(file, `${JSON.stringify(pkg, null, 2)}\n`);
      changed.push(path.relative(workspaceRoot, file));
    }
  }

  return changed;
}

async function main() {
  const latestCanary = getLatestCanary();
  console.log(`Latest sqs-consumer canary: ${latestCanary}`);
  const changedFiles = await updatePackages(latestCanary);

  if (changedFiles.length === 0) {
    console.log('All packages already use the latest canary release.');
    return;
  }

  console.log('Updated sqs-consumer version in:');
  for (const file of changedFiles) {
    console.log(` - ${file}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

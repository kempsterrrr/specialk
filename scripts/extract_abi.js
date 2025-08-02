#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { execSync } from 'node:child_process';

// Paths
const CONTRACTS_DIR = join(process.cwd(), 'contracts');
const ABIS_DIR = join(process.cwd(), 'abis');

// Count all files recursively in a directory
function countFilesRecursively(dir, extension) {
  let count = 0;
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = statSync(fullPath);
    
    if (stats.isDirectory()) {
      count += countFilesRecursively(fullPath, extension);
    } else if (item.endsWith(extension)) {
      count++;
    }
  }
  
  return count;
}

// Validate the number of generated ABIs against the number of contract files
if (process.argv.includes('--validate')) {
  const contractCount = countFilesRecursively(CONTRACTS_DIR, '.sol');
  const abiCount = countFilesRecursively(ABIS_DIR, '.json');
  
  console.log(`\nValidation Check:`);
  console.log(`  - Total contract files: ${contractCount}`);
  console.log(`  - Total generated ABIs: ${abiCount}`);
  
  if (abiCount === contractCount) {
    console.log('\n✅ OK: The number of generated ABIs matches the number of contract files.');
  } else {
    console.log('\n❌ NOK: The number of generated ABIs does not match the number of contract files.');
  }
} 
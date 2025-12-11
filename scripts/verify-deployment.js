#!/usr/bin/env node

/**
 * Cloudflare Deployment Verification Script
 * This script verifies that all required configuration files are present
 * and properly configured for Cloudflare Pages deployment.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 Verifying Cloudflare deployment configuration...\n');

const checks = [];

// Check wrangler.toml
try {
    const wranglerConfig = readFileSync('wrangler.toml', 'utf8');
    const hasName = wranglerConfig.includes('name = ');
    const hasMain = wranglerConfig.includes('main = ');
    const hasCompatibilityDate = wranglerConfig.includes('compatibility_date = ');

    checks.push({
        name: 'wrangler.toml',
        status: hasName && hasMain && hasCompatibilityDate ? '✅' : '❌',
        details: hasName && hasMain && hasCompatibilityDate ? 'Properly configured' : 'Missing required fields'
    });
} catch (error) {
    checks.push({
        name: 'wrangler.toml',
        status: '❌',
        details: 'File not found or cannot be read'
    });
}

// Check svelte.config.js
try {
    const svelteConfig = readFileSync('svelte.config.js', 'utf8');
    const hasCloudflareAdapter = svelteConfig.includes('@sveltejs/adapter-cloudflare');
    const hasPlatformProxy = svelteConfig.includes('platformProxy');

    checks.push({
        name: 'svelte.config.js',
        status: hasCloudflareAdapter && hasPlatformProxy ? '✅' : '❌',
        details: hasCloudflareAdapter && hasPlatformProxy ? 'Cloudflare adapter configured' : 'Missing Cloudflare configuration'
    });
} catch (error) {
    checks.push({
        name: 'svelte.config.js',
        status: '❌',
        details: 'File not found or cannot be read'
    });
}

// Check package.json
try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const hasAdapter = packageJson.devDependencies?.['@sveltejs/adapter-cloudflare'];
    const hasWrangler = packageJson.devDependencies?.['wrangler'];

    checks.push({
        name: 'package.json',
        status: hasAdapter && hasWrangler ? '✅' : '❌',
        details: hasAdapter && hasWrangler ? 'Required dependencies present' : 'Missing Cloudflare dependencies'
    });
} catch (error) {
    checks.push({
        name: 'package.json',
        status: '❌',
        details: 'File not found or invalid JSON'
    });
}

// Check for build output
try {
    const { statSync } = require('fs');
    statSync('.svelte-kit/cloudflare');
    checks.push({
        name: 'Build output',
        status: '✅',
        details: '.svelte-kit/cloudflare directory exists'
    });
} catch (error) {
    checks.push({
        name: 'Build output',
        status: '⚠️',
        details: 'Run bun run build to generate Cloudflare build artifacts'
    });
}

// Print results
console.log('Configuration Checks:');
console.log('='.repeat(50));

let allPassed = true;
checks.forEach(check => {
    console.log(`${check.status} ${check.name}: ${check.details}`);
    if (check.status === '❌') {
        allPassed = false;
    }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
    console.log('🎉 All configuration checks passed!');
    console.log('\nNext steps:');
    console.log('1. Set environment variables in Cloudflare Pages dashboard');
    console.log('2. Deploy using: wrangler pages deploy .svelte-kit/cloudflare');
    console.log('3. Or connect your GitHub repository for automatic deployments');
} else {
    console.log('❌ Some configuration issues found. Please fix the above issues before deploying.');
    process.exit(1);
}
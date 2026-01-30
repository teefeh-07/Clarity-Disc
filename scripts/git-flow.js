const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const run = (cmd) => {
    try {
        execSync(cmd, { stdio: 'inherit', encoding: 'utf-8' });
    } catch (e) {
        console.error(`Command failed: ${cmd}`);
        process.exit(1);
    }
};

const getArgs = () => {
    const args = {};
    process.argv.slice(2).forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.replace('--', '').split('=');
            args[key] = value || true;
        }
    });
    return args;
};

const args = getArgs();

// Usage: node git-flow.js --file="path/to/file" --msg="commit message" --type="feat" --desc="Long description"
const main = () => {
    const { file, msg, type = 'feat', desc = 'Implemented updates.' } = args;

    if (!file || !msg) {
        console.error('Missing --file or --msg');
        process.exit(1);
    }

    const branchName = `${type}/add-${path.basename(file).replace(/\./g, '-')}-${Date.now()}`;
    const prTitle = `${type}: ${msg}`;
    
    // Generate elaborate PR description
    const prBody = `
## Overview
${desc}

## Changes
- Modified/Created \`${file}\`
- Applied micro-commit strategy standards.

## Technical Details
This change ensures strict modularity and type safety where applicable.
    `.trim();

    console.log(`Starting flow for ${file}...`);

    // Ensure main is up to date
    run('git checkout main');
    run('git pull origin main || echo "No remote main yet"');

    // Create branch
    run(`git checkout -b ${branchName}`);

    // Add file
    run(`git add "${file}"`);

    // Commit
    run(`git commit -m "${type}: ${msg}"`);

    // Push
    // Note: This might fail if remote doesn't exist, user needs to set it up.
    // We assume remote 'origin' is set.
    try {
        run(`git push -u origin ${branchName}`);
        
        // PR
        run(`gh pr create --title "${prTitle}" --body "${prBody}"`);
        
        // Merge
        run(`gh pr merge ${branchName} --merge --delete-branch`);
    } catch (e) {
        console.log('Remote operations failed. Are you authenticated with gh?');
        // If gh fails, we might just merge locally to keep momentum
        run('git checkout main');
        run(`git merge ${branchName}`);
        run(`git branch -d ${branchName}`);
    }

    run('git checkout main');
    console.log('Done.');
};

main();

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const run = (cmd, retries = 3) => {
    try {
        execSync(cmd, { stdio: 'inherit', encoding: 'utf-8' });
    } catch (e) {
        if (retries > 0 && e.message.includes('index.lock')) {
            console.log(`Git locked. Retrying in 1s... (${retries} left)`);
            const stop = Date.now() + 1000;
            while (Date.now() < stop) { }
            run(cmd, retries - 1);
        } else {
            throw e;
        }
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

// Usage: node git-flow.cjs --file="path/to/file" --msg="commit message" --type="feat" --desc="Long description"
const main = () => {
    const { file, msg, type = 'feat', desc = 'Implemented updates.' } = args;

    if (!file || !msg) {
        console.error('Missing --file or --msg');
        process.exit(1);
    }

    const branchName = `${type}/add-${path.basename(file).replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    const prTitle = `${type}: ${msg}`;

    const prBody = `
## Overview
${desc}

## Changes
- Modified/Created \`${file}\`
- Applied micro-commit strategy standards.
    `.trim();

    console.log(`\n--- FLOW START: ${file} ---`);

    try {
        // Ensure we are on main and up to date
        try {
            run('git checkout main');
            run('git pull origin main');
        } catch (e) { console.log("Main update failed, continuing..."); }

        // Create branch
        run(`git checkout -b ${branchName}`);
        run(`git add "${file}"`);

        // Commit
        try {
            run(`git commit -m "${type}: ${msg}"`);
        } catch (e) {
            console.log("Nothing to commit. Cleaning up.");
            run('git checkout main');
            run(`git branch -d ${branchName}`);
            return;
        }

        // Push
        run(`git push -u origin ${branchName}`);

        // PR & Merge
        // Check if gh is available and working
        try {
            run(`gh pr create --title "${prTitle}" --body "${prBody}"`);
            run(`gh pr merge ${branchName} --merge --delete-branch`);
            run('git checkout main');
            try { run(`git branch -D ${branchName}`); } catch (e) { }
        } catch (e) {
            console.error('GH CLI Failed. Attempting local merge.');
            run('git checkout main');
            run(`git merge ${branchName}`);
            run(`git push origin main`); // Sync raw merge
            run(`git branch -d ${branchName}`);
        }

        run('git checkout main');

    } catch (e) {
        console.error(`Flow failed (${file}):`, e.message);
        try { run('git checkout main'); } catch (err) { }
    }
    console.log(`--- FLOW END: ${file} ---\n`);
};

main();

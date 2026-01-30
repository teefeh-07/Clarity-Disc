const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const run = (cmd) => {
    try { execSync(cmd, { stdio: 'inherit' }); } catch (e) { }
};

const gitFlow = (file, msg, type) => {
    run(`node scripts/git-flow.cjs --file="${file}" --msg="${msg}" --type="${type}" --desc="Auto-generated content for ${type}."`);
};

const main = () => {
    console.log("Starting Advanced Generator...");

    // 1. Utils: 30 files * 2 commits = 60 commits
    const utilsDir = 'src/utils';
    if (!fs.existsSync(utilsDir)) fs.mkdirSync(utilsDir, { recursive: true });

    for (let i = 1; i <= 30; i++) {
        const file = `${utilsDir}/helper-${i}.ts`;
        fs.writeFileSync(file, `export const helper${i} = () => "value${i}";`);
        gitFlow(file, `refactor: add helper ${i}`, 'refactor');

        fs.appendFileSync(file, `\nexport const helper${i}v2 = () => "value${i}v2";`);
        gitFlow(file, `refactor: update helper ${i}`, 'refactor');
    }

    // 2. Hooks: 20 files * 2 commits = 40 commits
    const hooksDir = 'src/hooks';
    if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

    for (let i = 1; i <= 20; i++) {
        const file = `${hooksDir}/useFeature${i}.ts`;
        fs.writeFileSync(file, `import { useState } from 'react';\n\nexport const useFeature${i} = () => useState(false);`);
        gitFlow(file, `feat: add hook ${i}`, 'feat');

        fs.appendFileSync(file, `\n// Updated hook logic`);
        gitFlow(file, `fix: optimize hook ${i}`, 'fix');
    }

    // 3. Components: 20 files * 2 commits = 40 commits
    const compDir = 'src/components/ui';
    if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });

    for (let i = 1; i <= 20; i++) {
        const file = `${compDir}/Comp${i}.tsx`;
        fs.writeFileSync(file, `import React from 'react';\n\nexport const Comp${i} = () => <div>Comp${i}</div>;`);
        gitFlow(file, `feat: add ui component ${i}`, 'feat');

        fs.appendFileSync(file, `\n// Styled component`);
        gitFlow(file, `style: style component ${i}`, 'style');
    }

    console.log("Advanced Generator Complete.");
};

main();

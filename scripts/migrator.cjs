const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Adjust relative path if script is run from root or scripts dir
// We assume run from root: node scripts/migrator.cjs
const sourceDir = path.resolve(__dirname, '../temp_frontend');
const destDir = path.resolve(__dirname, '../');

const walk = (dir, fileList = []) => {
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath, fileList);
        } else {
            fileList.push(path.relative(sourceDir, filePath));
        }
    });
    return fileList;
};

const run = (cmd) => {
    try {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit', cwd: destDir });
    } catch (e) {
        console.error(`Status: Failed ${cmd}`);
    }
};

const main = () => {
    const files = walk(sourceDir);
    console.log(`Found ${files.length} files to migrate.`);

    files.forEach((file) => {
        if (file === '.gitignore') return;

        const src = path.join(sourceDir, file);
        const dest = path.join(destDir, file);
        const dir = path.dirname(dest);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.copyFileSync(src, dest);

        // Run git-flow
        const cmd = `node scripts/git-flow.cjs --file="${file.replace(/\\/g, '/')}" --msg="build: setup ${path.basename(file)}" --type="build" --desc="Scaffold ${file} for React project structure."`;
        run(cmd);

        // rudimentary sleep to prevent race conditions on local git lock
        const end = Date.now() + 1000;
        while (Date.now() < end) { }
    });
};

main();

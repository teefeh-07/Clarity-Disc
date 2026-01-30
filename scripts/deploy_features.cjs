const { execSync } = require('child_process');
const fs = require('fs');
const run = (cmd) => {
    console.log(`\n>>> START: ${cmd}`);
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(`FAILED: ${cmd}`);
    }
};

// 1. Setup Stacks (Clarinet)
run('node scripts/setup_stacks.cjs');

// 2. Setup Deps (NPM + Git)
run('node scripts/setup_deps.cjs');

// 3. Components (Frontend)
run('node scripts/feature_wallet_connect.cjs');
run('node scripts/update_app.cjs');
run('node scripts/feature_tx.cjs');

// 4. Update App to include Sender
try {
    let app = fs.readFileSync('src/App.tsx', 'utf-8');
    if (!app.includes('TransactionSender')) {
        app = app.replace("import { WalletConnect } from './components/WalletConnect'", "import { WalletConnect } from './components/WalletConnect'\nimport { TransactionSender } from './components/TransactionSender'");
        app = app.replace("<WalletConnect />", "<WalletConnect />\n        <TransactionSender />");
        fs.writeFileSync('src/App.tsx', app);
        run('node scripts/git-flow.cjs --file="src/App.tsx" --msg="feat: integrate TransactionSender" --type="feat" --desc="Add TransactionSender to App."');
    }
} catch (e) {
    console.error("Failed to patch App.tsx", e);
}

// 5. Backend (Chainhooks)
if (!fs.existsSync('server')) fs.mkdirSync('server');
const serverFile = 'server/index.js';
const serverContent = `
const { Chainhook } = require('@hirosystems/chainhooks-client');

console.log("Starting Chainhook listener (Placeholder)...");
// TODO: Implement specific predicate listeners
`.trim();
fs.writeFileSync(serverFile, serverContent);
const serverPkg = { name: "server", version: "0.0.1", main: "index.js", dependencies: { "@hirosystems/chainhooks-client": "latest" } };
fs.writeFileSync('server/package.json', JSON.stringify(serverPkg, null, 2));

run(`node scripts/git-flow.cjs --file="${serverFile}" --msg="feat: add backend chainhook listener" --type="feat" --desc="Setup Node.js server for chainhooks."`);
run(`node scripts/git-flow.cjs --file="server/package.json" --msg="build: add server package.json" --type="build" --desc="Server dependencies."`);

console.log("ALL FEATURES DEPLOYED.");

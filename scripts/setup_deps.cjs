const { execSync } = require('child_process');
const run = (cmd) => {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
};

// Install Stacks deps
run('npm install @stacks/connect @stacks/transactions @stacks/network @stacks/common');
run('npm install @hirosystems/chainhooks-client');

// Install WalletConnect
run('npm install @walletconnect/web3wallet @walletconnect/core');

// Run git-flow for package.json
run('node scripts/git-flow.cjs --file="package.json" --msg="chore: add stacks and walletconnect dependencies" --type="chore" --desc="Install required dependencies."');
run('node scripts/git-flow.cjs --file="package-lock.json" --msg="chore: lock dependencies" --type="chore" --desc="Lockfile update."');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const run = (cmd) => {
    try {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit', encoding: 'utf-8' });
    } catch (e) {
        console.error(`Command failed: ${cmd}`);
    }
};

const gitFlow = (file, msg, type = 'feat') => {
    const cmd = `node scripts/git-flow.cjs --file="${file}" --msg="${msg}" --type="${type}" --desc="Implementation of ${path.basename(file)} based on requirements."`;
    run(cmd);
};

const main = () => {
    // 1. Clarinet.toml
    const tomlContent = `
[project]
name = "Clarity-Disc"
authors = []
description = ""
telemetry = true
cache_dir = "./.clarinet/cache"
requirements = []

[contracts.clarity-disc]
path = "contracts/clarity-disc.clar"
clarity_version = 4
epoch = "3.3"

[repl.analysis]
passes = ["check_checker"]

[repl.analysis.check_checker]
strict = false
trusted_sender = false
trusted_caller = false
callee_filter = false
    `.trim();

    fs.writeFileSync('Clarinet.toml', tomlContent);
    gitFlow('Clarinet.toml', 'init clarinet config', 'config');

    // 2. Contracts Dir and Contract
    if (!fs.existsSync('contracts')) fs.mkdirSync('contracts');

    // Create a sample contract that uses clarity 4 and avoids as-contract
    const contractContent = `
;; Clarity-Disc Contract
(define-data-var counter int 0)

(define-public (increment)
    (begin
        (var-set counter (+ (var-get counter) 1))
        (ok (var-get counter))
    )
)

(define-read-only (get-counter)
    (ok (var-get counter))
)
    `.trim();

    fs.writeFileSync('contracts/clarity-disc.clar', contractContent);
    gitFlow('contracts/clarity-disc.clar', 'init clarity-disc contract', 'feat');
};

main();

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const run = (cmd) => {
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(e);
    }
};

const file = 'src/components/WalletConnect.tsx';
const content = `
import React, { useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const WalletConnect = () => {
  const [authenticated, setAuthenticated] = useState(userSession.isUserSignedIn());

  const authenticate = () => {
    showConnect({
      appDetails: {
        name: 'Clarity-Disc',
        icon: window.location.origin + '/vite.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        setAuthenticated(true);
      },
      userSession,
    });
  };

  const signOut = () => {
    userSession.signUserOut();
    setAuthenticated(false);
  };

  return (
    <div className="card">
      {authenticated ? (
         <button onClick={signOut}>Disconnect Wallet</button>
      ) : (
         <button onClick={authenticate}>Connect Stacks Wallet</button>
      )}
    </div>
  );
};
`.trim();

// Ensure dir
const dir = path.dirname(file);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(file, content);

// Run git flow
// We use a safe path for Windows
run(`node scripts/git-flow.cjs --file="${file}" --msg="feat: add WalletConnect component" --type="feat" --desc="Implement Stacks Wallet connection using @stacks/connect."`);

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
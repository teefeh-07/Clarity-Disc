const { execSync } = require('child_process');
const fs = require('fs');

const run = (cmd) => {
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) { console.error(e); }
};

const file = 'src/App.tsx';
// Basic App structure with WalletConnect
const content = `
import { useState } from 'react'
import './App.css'
import { WalletConnect } from './components/WalletConnect'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <h1>Clarity-Disc</h1>
      <div className="card">
        <WalletConnect />
        <div style={{ marginTop: '20px' }}>
            <button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
            </button>
        </div>
      </div>
    </div>
  )
}

export default App
`.trim();

fs.writeFileSync(file, content);
run(`node scripts/git-flow.cjs --file="${file}" --msg="feat: integrate WalletConnect in App" --type="feat" --desc="Add WalletConnect component to main App view."`);

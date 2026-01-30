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
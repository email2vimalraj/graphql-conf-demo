import React from 'react'

import './App.css'
import GraphContainer from './GraphContainer'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            width: '500px',
            height: '300px'
          }}
        >
          <GraphContainer />
        </div>
      </header>
    </div>
  )
}

export default App

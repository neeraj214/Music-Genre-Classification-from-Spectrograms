import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--bg-main)' }}>
      <h1 className="text-5xl font-bold mb-4 text-gradient">
        🎵 Music Genre Classifier
      </h1>
      <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
        Upload audio — let AI detect the genre.
      </p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

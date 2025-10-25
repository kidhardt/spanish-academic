import React from 'react'
import ReactDOM from 'react-dom/client'
import Explorer from './Explorer'
import './explorer.css'

const rootElement = document.getElementById('explorer-root')

if (!rootElement) {
  throw new Error('Explorer root element not found. Ensure #explorer-root exists in the HTML.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Explorer />
  </React.StrictMode>,
)

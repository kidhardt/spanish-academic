import React from 'react'
import ReactDOM from 'react-dom/client'
import Chat from './Chat'
import './chat.css'

const rootElement = document.getElementById('chat-root')

if (!rootElement) {
  throw new Error('Chat root element not found. Ensure #chat-root exists in the HTML.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Chat />
  </React.StrictMode>,
)

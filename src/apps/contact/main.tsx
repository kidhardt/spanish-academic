import React from 'react'
import ReactDOM from 'react-dom/client'
import ContactForm from './ContactForm'
import './contact.css'

const rootElement = document.getElementById('contact-root')

if (!rootElement) {
  throw new Error('Contact root element not found. Ensure #contact-root exists in the HTML.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ContactForm />
  </React.StrictMode>,
)

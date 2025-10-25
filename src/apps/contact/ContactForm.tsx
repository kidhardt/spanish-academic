import React from 'react'

/**
 * ContactForm component - User contact/feedback form
 * This is a React island that loads only on pages with #contact-root
 */
const ContactForm: React.FC = () => {
  return (
    <div className="contact-form">
      <h2>Contact Us</h2>
      <p>Contact form coming soon...</p>
      {/* TODO: Implement form with @tanstack/react-form */}
    </div>
  )
}

export default ContactForm

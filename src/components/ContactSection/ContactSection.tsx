import React, { forwardRef, useState } from 'react';
import './ContactSection.css';

export const ContactSection = forwardRef<HTMLDivElement>((_props, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div ref={ref} className="contact-section-container">
      {/* Ambient background glows */}
      <div className="contact-bg-glow-top" />
      <div className="contact-bg-glow-bottom" />

      {/* Decorative Dotted Matrix */}
      <div className="contact-bg-dots">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="contact-dot" />
        ))}
      </div>

      <div className="contact-content-grid">
        {/* Left Column: Heading, Quick Bar & 3 Information Cards */}
        <div className="contact-left-col">
          <div className="contact-top-badge">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span>Get in Touch</span>
          </div>

          <h1 className="contact-main-heading">
            Contact <span className="heading-blue">Us</span>
          </h1>

          <p className="contact-subtext">
            Email, call or complete the form to learn more about our services and pricing.
          </p>

          {/* Quick Contact Bar */}
          <div className="contact-quick-bar">
            <a href="mailto:am@amautodesigners.com" className="quick-pill">
              <div className="quick-icon-circle">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <span>am@amautodesigners.com</span>
            </a>

            <div className="quick-divider" />

            <a href="tel:+919790384400" className="quick-pill">
              <div className="quick-icon-circle">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span>+91 97903 84400</span>
            </a>
          </div>

          {/* 3 Detail Cards Row */}
          <div className="contact-cards-row">
            {/* Card 1: Address */}
            <div className="contact-card">
              <div className="card-header-row">
                <div className="card-icon-box blue">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="card-title">Address</h3>
              </div>

              <div className="card-content-body">
                <div>
                  <div className="card-company-name">AM Auto Designer</div>
                  5/339-4A, Ramakrishna Nagar,<br />
                  Near Sanjeev Nagar, Pannimadai Post,<br />
                  Coimbatore - 641017
                </div>
              </div>

              {/* Map Graphic Pin */}
              <svg
                className="card-map-backdrop"
                viewBox="0 0 100 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 35 L30 15 L70 45 L100 20"
                  stroke="#bfdbfe"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle cx="70" cy="45" r="5" fill="#2563eb" />
                <circle cx="70" cy="45" r="9" stroke="#2563eb" strokeOpacity="0.4" strokeWidth="2" />
              </svg>
            </div>

            {/* Card 2: Contact Person */}
            <div className="contact-card">
              <div className="card-header-row">
                <div className="card-icon-box green">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3 className="card-title">Contact</h3>
              </div>

              <div className="card-content-body">
                <div className="contact-person">
                  <span className="person-name">Mr. A.V. Sidhik</span>
                  <a href="tel:+919790384400" className="person-phone">
                    +91 97903 84400
                  </a>
                </div>

                <div className="contact-person">
                  <span className="person-name">Mr A.V. Abdul Samed</span>
                  <a href="tel:+919790696700" className="person-phone">
                    +91 97906 96700
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3: Instagram */}
            <div className="contact-card">
              <div className="card-header-row">
                <div className="card-icon-box instagram">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <h3 className="card-title">Instagram</h3>
              </div>

              <div className="card-content-body">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="card-instagram-handle"
                >
                  <span>Am Auto Designers</span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </a>

                <div className="card-thumbnail-box">
                  <img
                    src="/paints/purplepaint.webp"
                    alt="AM Auto Designers Van"
                    className="card-thumbnail-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="card-thumbnail-arrow">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Decorative Dot Matrix (2nd column of row 2) */}
            <div className="contact-card-dots" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="card-dot" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Floating Contact Form Card */}
        <div className="contact-form-card">
          <div className="form-header">
            <div className="form-header-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            <div className="form-header-text">
              <h2 className="form-title">Get in Touch</h2>
              <p className="form-subtitle">You can reach us any time</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form-inner">
            {/* Name Input */}
            <div className="input-field-group">
              <span className="input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Name"
                className="contact-input"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Email Input */}
            <div className="input-field-group">
              <span className="input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Email"
                className="contact-input"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Subject Select */}
            <div className="input-field-group">
              <span className="input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </span>
              <select
                className="contact-select"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="">Subject</option>
                <option value="luxury-interior">Luxury Interior Transformation</option>
                <option value="custom-seating">Custom Executive Seating</option>
                <option value="lighting-audio">Ambient Lighting & Audio</option>
                <option value="quote">General Pricing & Quote</option>
              </select>
              <span className="select-chevron">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>

            {/* Message Textarea */}
            <div className="input-field-group textarea-group">
              <span className="input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <textarea
                placeholder="Message"
                className="contact-textarea"
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className={`form-submit-btn ${submitted ? 'submitted' : ''}`}>
              {submitted ? (
                <span>Message Sent Successfully! ✓</span>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>Send Message →</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

ContactSection.displayName = 'ContactSection';

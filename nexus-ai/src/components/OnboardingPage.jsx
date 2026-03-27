import { useState } from 'react'

const ROLES = [
  // Product
  'Product Manager',
  'Product Analyst',
  'Business Analyst',
  'UX Researcher',
  // Engineering
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'QA Engineer',
  // Data & Analytics
  'Data Analyst',
  'Data Scientist',
  'Business Intelligence (BI) Analyst',
  'Analytics Engineer',
  // Marketing
  'Digital Marketing Specialist',
  'SEO Specialist',
  'Email Marketing Manager',
  'Growth Hacker',
  'Content Strategist',
  // E-commerce
  'E-commerce Merchandiser',
  'Catalog Manager',
  'Pricing Analyst',
  'Vendor/Category Manager',
  // Operations
  'Operations Manager',
  'Supply Chain Analyst',
  'Inventory Planner',
  'Fulfillment Coordinator',
  // Customer
  'Customer Support Representative',
  'Customer Success Manager',
  'CX Analyst',
  // Sales & Partnerships
  'Account Manager',
  'Sales Executive',
  'Partnership Manager',
  // Finance & Admin
  'Financial Analyst',
  'Accountant',
  'HR Manager',
  'Legal/Compliance Officer',
  // Specialised
  'Conversion Rate Optimization (CRO) Specialist',
  'Marketplace Manager',
  'Retention/CRM Manager',
  'Fraud Analyst',
]

const INDUSTRIES = [
  'E-commerce / Retail',
  'SaaS / Software',
  'Fintech / Finance',
  'Healthcare',
  'Media & Entertainment',
  'Logistics & Supply Chain',
  'Education / EdTech',
  'Travel & Hospitality',
  'Real Estate',
  'Consumer Goods',
  'Agency / Consulting',
  'Other',
]

export default function OnboardingPage({ onComplete }) {
  const [name, setName]         = useState('')
  const [industry, setIndustry] = useState('')
  const [role, setRole]         = useState('')
  const [roleSearch, setRoleSearch] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const filteredRoles = ROLES.filter(r =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim())     { setError('Please enter your name.'); return }
    if (!industry)        { setError('Please select your industry.'); return }
    if (!role)            { setError('Please select your role.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onComplete({ name, industry, role })
    }, 700)
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-mark">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="5" fill="var(--accent)" opacity="0.15"/>
              <path d="M5 10h10M10 5l5 5-5 5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="auth-logo-text">NEXUS<sup>AI</sup></span>
        </div>

        {/* Step indicator */}
        <div className="onboard-steps">
          <div className="onboard-step done">
            <div className="onboard-step-dot done">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="var(--bg-base)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Account</span>
          </div>
          <div className="onboard-step-line active" />
          <div className="onboard-step active">
            <div className="onboard-step-dot active">2</div>
            <span>Profile</span>
          </div>
          <div className="onboard-step-line" />
          <div className="onboard-step">
            <div className="onboard-step-dot">3</div>
            <span>Workspace</span>
          </div>
        </div>

        <h1 className="auth-heading" style={{ marginTop: '8px' }}>Tell us about yourself</h1>
        <p className="auth-subheading">This helps Nexus personalise your command center.</p>

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Name */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="fullname">Full name</label>
            <input
              id="fullname"
              className="auth-input"
              type="text"
              placeholder="Jordan Lee"
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Industry */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="industry">Industry</label>
            <div className="auth-select-wrap">
              <select
                id="industry"
                className="auth-select"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
              >
                <option value="" disabled>Select your industry…</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <svg className="auth-select-icon" width="12" height="12" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Role */}
          <div className="auth-field">
            <label className="auth-label">Your role</label>
            {role && (
              <div className="onboard-selected-role">
                <span>{role}</span>
                <button type="button" className="onboard-clear-role" onClick={() => { setRole(''); setRoleSearch('') }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 1l8 8M9 1L1 9"/>
                  </svg>
                </button>
              </div>
            )}
            {!role && (
              <div className="onboard-role-picker">
                <div className="onboard-role-search-wrap">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <circle cx="7" cy="7" r="5"/>
                    <path d="M11 11l3 3"/>
                  </svg>
                  <input
                    className="onboard-role-search"
                    placeholder="Search roles…"
                    value={roleSearch}
                    onChange={e => setRoleSearch(e.target.value)}
                  />
                </div>
                <div className="onboard-role-list">
                  {filteredRoles.length === 0 && (
                    <div className="onboard-role-empty">No roles match "{roleSearch}"</div>
                  )}
                  {filteredRoles.map(r => (
                    <button
                      key={r}
                      type="button"
                      className="onboard-role-item"
                      onClick={() => setRole(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Enter Nexus →'}
          </button>
        </form>
      </div>

      <p className="auth-page-footer">
        Secured by <strong>Nexus</strong> · <span>Privacy</span> · <span>Terms</span>
      </p>
    </div>
  )
}
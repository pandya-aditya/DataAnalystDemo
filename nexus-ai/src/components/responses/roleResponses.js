/**
 * Role Response Components — Index
 *
 * Maps each role category from roleSessions.js to its corresponding
 * multi-step Response components. Each category has exactly 3 steps
 * (matching the pattern in roleSessions.js) unless noted.
 *
 * Usage:
 *   import { getResponsesForCategory } from './roleResponses'
 *   const steps = getResponsesForCategory('marketing') // returns [Step1, Step2, Step3]
 */

// ─── Product (PM, Analyst, BA, UX Researcher, CRO Specialist) ────────────────
export {
  ProductResponse1,  // Step 1: Margin bleed diagnosis + category mix scatter + actions
  ProductResponse2,  // Step 2: Q2 growth plan levers + waterfall + actions
  ProductResponse3,  // Step 3: Board deck Q2 section + KPI cards + actions
} from './ProductResponses'

// ─── Engineering (FE, BE, Full Stack, DevOps, QA) ────────────────────────────
export {
  EngineeringResponse1,  // Step 1: Reliability audit + latency chart + top 3 fixes
  EngineeringResponse2,  // Step 2: 1-week execution plan + monitoring action cards
  EngineeringResponse3,  // Step 3: Post-ship stakeholder update + metrics tracking table
} from './EngineeringResponses'

// ─── Data & Analytics (Analyst, Scientist, BI, Analytics Engineer) ───────────
export {
  DataResponse1,  // Step 1: Top 10 KPI definitions + metric layer table
  DataResponse2,  // Step 2: 6 automated DQ checks + alert routing
  DataResponse3,  // Step 3: Exec vs operator dashboard outline + retention chart
} from './DataResponses'

// ─── Marketing (Digital, SEO, Email, Growth, Content, CRM, Marketplace) ──────
export {
  MarketingResponse1,  // Step 1: 7-day channel audit + CAC trend chart + channel table
  MarketingResponse2,  // Step 2: 2-week 3-experiment test plan + weekly breakdown
  MarketingResponse3,  // Step 3: Stakeholder update + auto-action timeline + approval ask
} from './MarketingResponses'

// ─── E-commerce (Merchandiser, Catalog, Pricing, Vendor/Category) ─────────────
export {
  CommerceResponse1,  // Step 1: SKU revenue ranking + margin risk chart + actions
  CommerceResponse2,  // Step 2: 2-week pricing + promo strategy table + implementation
  CommerceResponse3,  // Step 3: Daily merchandising workflow checklist + weekly cadence
} from './CommerceResponses'

// ─── Operations (Ops Manager, Supply Chain, Inventory, Fulfillment) ────────────
export {
  OpsResponse1,  // Step 1: Ops risk snapshot + fulfillment chart + priority actions
  OpsResponse2,  // Step 2: 10-day reorder + fulfillment plan + alert configuration
  OpsResponse3,  // Step 3: Leadership update + approvals for expedited spend + staffing
} from './OpsResponses'

// ─── Customer (Support Rep, CSM, CX Analyst) ──────────────────────────────────
export {
  CustomerResponse1,  // Step 1: Ticket volume chart + driver table + 3 deflection opportunities
  CustomerResponse2,  // Step 2: 5 macros + 3 automation rules (handle time savings table)
  CustomerResponse3,  // Step 3: Weekly CX report narrative + action items + projection
} from './CustomerResponses'

// ─── Sales & Partnerships (Account Manager, Sales Exec, Partnership Manager) ──
export {
  SalesResponse1,  // Step 1: Pipeline stage chart + deal risk table + next best actions
  SalesResponse2,  // Step 2: 2-week outreach cadence table + message templates
  SalesResponse3,  // Step 3: Leadership pipeline update + exec sponsor + pricing approval asks
} from './SalesResponses'

// ─── Finance & Admin (Financial Analyst, Accountant, HR, Legal) ───────────────
export {
  FinanceResponse1,  // Step 1: Profit waterfall chart + variance driver table
  FinanceResponse2,  // Step 2: 2-week margin protection plan + daily monitoring setup
  FinanceResponse3,  // Step 3: Leadership finance readout — narrative format with approvals
} from './FinanceResponses'

// ─── Risk (Fraud Analyst) ─────────────────────────────────────────────────────
export {
  RiskResponse1,  // Step 1: Fraud trends chart + risk signal table + 3 targeted mitigations
  RiskResponse2,  // Step 2: Monitoring dashboard outline + alert thresholds + routing
  RiskResponse3,  // Step 3: Weekly fraud leadership update + watchouts + net assessment
} from './RiskResponses'


// ─── Category → component map ─────────────────────────────────────────────────
// Mirrors ROLE_CATEGORY from roleSessions.js

import {
  ProductResponse1, ProductResponse2, ProductResponse3,
} from './ProductResponses'
import {
  EngineeringResponse1, EngineeringResponse2, EngineeringResponse3,
} from './EngineeringResponses'
import {
  DataResponse1, DataResponse2, DataResponse3,
} from './DataResponses'
import {
  MarketingResponse1, MarketingResponse2, MarketingResponse3,
} from './MarketingResponses'
import {
  CommerceResponse1, CommerceResponse2, CommerceResponse3,
} from './CommerceResponses'
import {
  OpsResponse1, OpsResponse2, OpsResponse3,
} from './OpsResponses'
import {
  CustomerResponse1, CustomerResponse2, CustomerResponse3,
} from './CustomerResponses'
import {
  SalesResponse1, SalesResponse2, SalesResponse3,
} from './SalesResponses'
import {
  FinanceResponse1, FinanceResponse2, FinanceResponse3,
} from './FinanceResponses'
import {
  RiskResponse1, RiskResponse2, RiskResponse3,
} from './RiskResponses'

const CATEGORY_RESPONSES = {
  product:     [ProductResponse1,     ProductResponse2,     ProductResponse3],
  engineering: [EngineeringResponse1, EngineeringResponse2, EngineeringResponse3],
  data:        [DataResponse1,        DataResponse2,        DataResponse3],
  marketing:   [MarketingResponse1,   MarketingResponse2,   MarketingResponse3],
  commerce:    [CommerceResponse1,    CommerceResponse2,    CommerceResponse3],
  ops:         [OpsResponse1,         OpsResponse2,         OpsResponse3],
  customer:    [CustomerResponse1,    CustomerResponse2,    CustomerResponse3],
  sales:       [SalesResponse1,       SalesResponse2,       SalesResponse3],
  finance:     [FinanceResponse1,     FinanceResponse2,     FinanceResponse3],
  risk:        [RiskResponse1,        RiskResponse2,        RiskResponse3],
}

/**
 * Returns [Step1Component, Step2Component, Step3Component] for a given category.
 * Falls back to an empty array if category is unknown.
 */
export function getResponsesForCategory(category) {
  return CATEGORY_RESPONSES[category] ?? []
}

/**
 * Returns a single step component by category + 0-indexed step number.
 * e.g. getResponseStep('marketing', 1) → MarketingResponse2
 */
export function getResponseStep(category, stepIndex) {
  return CATEGORY_RESPONSES[category]?.[stepIndex] ?? null
}

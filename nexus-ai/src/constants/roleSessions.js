const ROLE_CATEGORY = {
  // Product
  'Product Manager': 'product',
  'Product Analyst': 'product',
  'Business Analyst': 'product',
  'UX Researcher': 'product',
  'Conversion Rate Optimization (CRO) Specialist': 'product',

  // Engineering
  'Frontend Developer': 'engineering',
  'Backend Developer': 'engineering',
  'Full Stack Developer': 'engineering',
  'DevOps Engineer': 'engineering',
  'QA Engineer': 'engineering',

  // Data & Analytics
  'Data Analyst': 'data',
  'Data Scientist': 'data',
  'Business Intelligence (BI) Analyst': 'data',
  'Analytics Engineer': 'data',

  // Marketing
  'Digital Marketing Specialist': 'marketing',
  'SEO Specialist': 'marketing',
  'Email Marketing Manager': 'marketing',
  'Growth Hacker': 'marketing',
  'Content Strategist': 'marketing',
  'Retention/CRM Manager': 'marketing',
  'Marketplace Manager': 'marketing',

  // E-commerce
  'E-commerce Merchandiser': 'commerce',
  'Catalog Manager': 'commerce',
  'Pricing Analyst': 'commerce',
  'Vendor/Category Manager': 'commerce',

  // Operations
  'Operations Manager': 'ops',
  'Supply Chain Analyst': 'ops',
  'Inventory Planner': 'ops',
  'Fulfillment Coordinator': 'ops',

  // Customer
  'Customer Support Representative': 'customer',
  'Customer Success Manager': 'customer',
  'CX Analyst': 'customer',

  // Sales & Partnerships
  'Account Manager': 'sales',
  'Sales Executive': 'sales',
  'Partnership Manager': 'sales',

  // Finance & Admin
  'Financial Analyst': 'finance',
  'Accountant': 'finance',
  'HR Manager': 'finance',
  'Legal/Compliance Officer': 'finance',

  // Specialised
  'Fraud Analyst': 'risk',
}

const shortName = (value) => {
  const trimmed = String(value || '').trim()
  return trimmed || 'Nexus'
}

const asText = (strings, ...values) => String.raw({ raw: strings }, ...values).trim()

const stepsFor = ({ name, industry, role, category }) => {
  const who = shortName(name)
  const industryLabel = String(industry || 'your industry').trim() || 'your industry'
  const roleLabel = String(role || 'your role').trim() || 'your role'

  if (category === 'product') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel} in ${industryLabel}. Summarize the top 5 user problems from the last 14 days and recommend 2 opportunities to prioritize this sprint.`,
          traces: [
            'Loading product analytics (funnels, retention, cohorts)...',
            'Pulling customer feedback (support tickets, NPS, reviews)...',
            'Clustering feedback by theme and severity...',
            'Quantifying impact: affected users × frequency × revenue proxy...',
            'Cross-referencing recent releases and known incidents...',
            'Drafting opportunity shortlist with effort/risk notes...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Here’s a sprint-ready view of what’s hurting users most right now and where you’ll get the biggest payoff.

              Top problems (last 14 days)
              1) Checkout friction on mobile — drop-offs spike at shipping selection; most common complaint: “too many steps”.
              2) Confusing returns/refunds expectations — users can’t find timelines; higher ticket volume and negative reviews.
              3) Inventory availability surprises — “in stock” → “backordered” after add-to-cart for a small set of SKUs.
              4) Slow first meaningful paint on PDP — correlates with lower conversion for new users.
              5) Promo code reliability — intermittent “code invalid” and stacking confusion.

              Two opportunities to prioritize
              A) Mobile checkout simplification (high impact, medium effort)
              - Reduce step count, prefill shipping, improve error copy, and instrument drop-off by field.
              - Success metrics: mobile CVR, checkout completion rate, time-to-complete, support tickets tagged “checkout”.

              B) Returns clarity + self-serve flow (medium-high impact, low-medium effort)
              - Add a clear policy module, proactive order-status messaging, and a guided return eligibility checker.
              - Success metrics: ticket deflection, CSAT, repeat purchase rate for returners.

              If you want, I can turn (A) into a PRD + experiment plan next.
            `,
          },
        },
        {
          prompt: `Turn the highest priority opportunity into a 1-page PRD with scope, out of scope, success metrics, and key risks.`,
          traces: [
            'Creating PRD skeleton (problem → goals → scope → metrics)...',
            'Selecting primary metrics and guardrails...',
            'Enumerating edge cases and compliance constraints...',
            'Drafting phased rollout plan...',
            'Ready.',
          ],
          ai: {
            text: asText`
              PRD (1-pager): Mobile Checkout Simplification

              Problem
              - Mobile checkout drop-offs are elevated at shipping selection and payment validation, driving lost orders and support load.

              Goals
              - Increase mobile checkout completion rate and reduce time-to-checkout without increasing fraud/chargebacks.

              Scope (MVP)
              - Reduce checkout steps (combine shipping + delivery options).
              - Prefill known fields for returning users.
              - Clear validation and error messaging (address, phone, payment).
              - Instrumentation: per-step drop-off, error rates by field, time-to-complete, recovery rate after errors.

              Out of scope (for MVP)
              - New payment methods, major redesign of cart, subscription/BNPL expansion.

              Success metrics
              - Primary: mobile checkout completion rate (+X%), mobile CVR (+X%).
              - Secondary: time-to-complete (-Y%), “checkout help” ticket volume (-Z%).
              - Guardrails: refund rate, chargeback rate, AOV.

              Key risks
              - Hidden complexity in shipping rules/taxes; regressions if edge cases are missed.
              - Prefill can introduce incorrect defaults; must show “edit” affordances clearly.
              - Analytics drift if events aren’t consistent across old/new flow.

              Next: I can propose an A/B test design + rollout checklist.
            `,
          },
        },
        {
          prompt: `Create an A/B test plan and rollout checklist for this PRD (including instrumentation and monitoring).`,
          traces: [
            'Designing experiment: population, duration, MDE...',
            'Defining events, properties, and funnels...',
            'Drafting monitoring + rollback criteria...',
            'Creating launch checklist for eng + QA...',
            'Ready.',
          ],
          ai: {
            text: asText`
              A/B test plan
              - Hypothesis: simplifying mobile checkout reduces friction at shipping/payment steps, increasing completion rate.
              - Variants: Control (current) vs Treatment (simplified step flow + improved validation copy).
              - Targeting: mobile web sessions; exclude internal traffic; keep returning/new split as a dimension.
              - Primary metric: checkout completion rate.
              - Guardrails: chargeback rate, refund rate, payment failure rate, page performance (LCP/INP).
              - Duration: run until you hit statistical power for completion-rate MDE; minimum 1 full week to cover weekday/weekend mix.

              Instrumentation
              - Events: checkout_step_viewed, checkout_step_completed, checkout_error_shown, checkout_error_recovered, payment_attempted, order_completed.
              - Properties: step_name, field_name, error_code, user_type, shipping_method, device, experiment_variant.

              Monitoring + rollback
              - Real-time dashboards for completion rate, payment failures, and error spikes.
              - Rollback triggers: payment failure +20% vs control, chargebacks trending up, severe checkout JS errors.

              Rollout checklist
              - QA: edge cases (international addresses, PO boxes, coupons, split shipments).
              - Performance: confirm no regression to LCP/INP on PDP/cart/checkout.
              - Observability: Sentry alerts for checkout errors; anomaly monitoring on completion rate.
              - Post-launch: review segment results (new vs returning, iOS vs Android), then ramp traffic.
            `,
          },
        },
      ],
    }
  }

  if (category === 'engineering') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel}. Audit the top reliability and performance issues affecting users this week and propose the fastest 3 fixes with the highest impact.`,
          traces: [
            'Reviewing frontend error logs and performance vitals...',
            'Scanning API latency percentiles and error rates...',
            'Identifying top crash/error signatures by user impact...',
            'Correlating performance regressions with recent deploys...',
            'Drafting remediation options and rollout risk...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Here are the top user-impacting issues and the 3 fastest high-leverage fixes to ship.

              What’s hurting users most (this week)
              - Client-side checkout JS errors: intermittent payment validation failures.
              - Slow PDP load on mobile: elevated LCP/INP on image-heavy pages.
              - Spiky API latency: p95 increased during traffic peaks; timeouts on a small set of endpoints.

              Fastest 3 fixes (highest impact per effort)
              1) Add defensive validation + better fallback UI on checkout
              - Prevent hard failures; log structured error codes for rapid triage.

              2) Reduce PDP payload + image strategy
              - Serve responsive images, prioritize above-the-fold assets, defer non-critical widgets.

              3) Stabilize p95 latency on critical endpoints
              - Add caching for hot reads, tighten DB indices for slow queries, and add circuit-breaker timeouts.

              If you want, I can turn this into a 1-week execution plan with owners and measurable acceptance criteria.
            `,
          },
        },
        {
          prompt: `Turn that into a 1-week execution plan with owners, acceptance criteria, and rollback/monitoring.`,
          traces: [
            'Breaking work into tickets with sequencing...',
            'Defining acceptance tests and SLO targets...',
            'Drafting monitoring/rollback criteria...',
            'Ready.',
          ],
          ai: {
            text: asText`
              1-week execution plan (draft)

              Day 1–2: Checkout reliability hardening (Owner: FE + QA)
              - Acceptance: checkout JS error rate -50%, payment validation failures -30%, no new regression in conversion.
              - Rollback: error rate or payment failures exceed baseline by 20% for 30 min.

              Day 2–4: PDP performance (Owner: FE)
              - Acceptance: mobile LCP improves by 300ms; INP improves by 50ms on top 20 PDPs.
              - Rollback: LCP/INP regression >10% on mobile cohort.

              Day 3–5: API latency stabilization (Owner: BE/Platform)
              - Acceptance: p95 latency back to target; timeout rate reduced; DB slow queries down.
              - Rollback: elevated 5xx or timeouts sustained for 15 min.

              Monitoring
              - Dashboards: checkout errors, conversion, LCP/INP, p95 API latency, 5xx rates.
              - Alerts: anomaly detection on checkout completion rate + Sentry spikes + API p95.
            `,
          },
        },
        {
          prompt: `Create a lightweight release note + stakeholder update I can post after we ship.`,
          traces: [
            'Summarizing user-facing changes and expected impact...',
            'Drafting concise stakeholder message...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Stakeholder update (post-ship)

              Shipped: reliability + performance improvements
              - Checkout: reduced intermittent validation failures and improved recovery messaging.
              - PDP: faster load on mobile via image and payload optimizations.
              - Backend: improved p95 latency on key endpoints during peak traffic.

              Impact we’re watching
              - Mobile checkout completion rate, payment failure rate, checkout JS errors.
              - Mobile LCP/INP on PDPs; p95 API latency and timeout rates.

              Next
              - If metrics hold for 48 hours, we’ll ramp the changes to 100% and close remaining edge cases.
            `,
          },
        },
      ],
    }
  }

  if (category === 'data') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel}. Define the 10 most important KPIs for ${industryLabel} and propose a clean metric definition layer (including edge cases).`,
          traces: [
            'Identifying business model and key value drivers...',
            'Selecting KPI set (acquisition, conversion, retention, profitability)...',
            'Drafting metric definitions and edge case handling...',
            'Ready.',
          ],
          ai: {
            text: asText`
              KPI set (top 10)
              1) Revenue (gross/net)  2) Gross margin  3) Contribution margin
              4) Conversion rate      5) AOV           6) CAC (blended + by channel)
              7) LTV (cohort-based)   8) Repeat purchase rate
              9) Refund/return rate   10) On-time fulfillment rate

              Metric definition layer (clean + consistent)
              - Revenue: define gross vs net (discounts, shipping, tax), and separate refunds/chargebacks.
              - CAC: allocate spend to cohorts; handle multi-touch vs last-touch; exclude brand search if needed.
              - LTV: cohort-based with censoring; define window (30/60/90d) and include margin if you need LTV: CAC.
              - Conversion: define session vs user-level; bot filtering; exclude internal traffic.
              - Returns: tie return to original order; handle partial returns and exchanges explicitly.
            `,
          },
        },
        {
          prompt: `Propose 6 automated data quality checks for this KPI layer and the alert thresholds.`,
          traces: [
            'Drafting freshness, volume, and schema checks...',
            'Defining anomaly thresholds and escalation paths...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Automated DQ checks (recommended)
              1) Freshness: core tables updated within SLA (alert if >2× expected delay).
              2) Volume: orders/events within expected band (alert if ±3σ vs 28-day baseline).
              3) Null rate: required fields (order_id, customer_id, revenue) null rate <0.5%.
              4) Duplicates: order_id uniqueness (alert if duplicates >0).
              5) Referential integrity: line_items join coverage >99.5%.
              6) Spend-to-order mapping coverage: attribution joins above threshold; alert if coverage drops >5 pts.
            `,
          },
        },
        {
          prompt: `Create a dashboard outline for executives vs operators (two views) and what each should include.`,
          traces: [
            'Selecting executive vs operator slices...',
            'Organizing sections by decision cadence...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Executive view (weekly)
              - Revenue, margin, CAC, LTV, ROAS, conversion, retention.
              - What changed vs last week and why (top 3 drivers).
              - Risks: anomalies, inventory/fulfillment constraints, refund spikes.

              Operator view (daily)
              - Channel-level spend efficiency (CAC/ROAS) + creative/campaign drilldowns.
              - Funnel diagnostics (PDP → ATC → checkout → purchase) with breakpoints.
              - Inventory/fulfillment SLA and backlog; returns/reasons by SKU.
              - Alerts + “next best actions” checklist.
            `,
          },
        },
      ],
    }
  }

  if (category === 'marketing') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel}. Analyze the last 7 days of acquisition performance and tell me the single biggest lever to improve efficiency next week.`,
          traces: [
            'Pulling channel spend + attributed revenue...',
            'Computing blended CAC/ROAS and cohort LTV...',
            'Segmenting by campaign, audience, and creative...',
            'Identifying inefficiencies and quick wins...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Biggest lever (next week): tighten spend to the top-performing segment and improve landing/offer alignment for the #1 traffic source.

              What I’d do first
              - Pause/trim bottom-quartile campaigns (highest CAC, lowest conversion).
              - Reallocate 15–25% of budget to the best audience × creative pair.
              - Fix the highest-friction landing path (mobile speed + message match) to capture wasted clicks.

              Success metrics
              - CAC down, ROAS up, and conversion rate up—without harming AOV or refund rate.
            `,
          },
        },
        {
          prompt: `Build a 2-week test plan (3 experiments) with hypotheses, success metrics, and budget allocation.`,
          traces: [
            'Designing experiments across creative, audience, and landing...',
            'Defining measurement and guardrails...',
            'Ready.',
          ],
          ai: {
            text: asText`
              2-week test plan (3 experiments)
              1) Creative: new angle + hook
              - Hypothesis: clearer value prop reduces bounce and improves CTR/CVR.
              - Metric: CTR, CVR, CAC. Guardrail: refund rate.

              2) Audience: high-intent retargeting split
              - Hypothesis: tighter retargeting window increases ROAS.
              - Metric: ROAS, CAC. Guardrail: frequency, CPM.

              3) Landing: message-match PDP variant
              - Hypothesis: aligning offer copy to ad promise improves conversion.
              - Metric: PDP → ATC rate, checkout start, purchase rate.

              Budget
              - 70% keep-the-lights-on winners, 30% experiments (rebalanced weekly).
            `,
          },
        },
        {
          prompt: `Draft the stakeholder update I should send (what we’re testing, why, and what success looks like).`,
          traces: [
            'Drafting concise update with goals and timeline...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Stakeholder update (draft)

              Next 2 weeks we’re running 3 focused acquisition experiments to improve efficiency while maintaining volume:
              - Creative refresh to improve click-through and message clarity.
              - Audience tightening in retargeting to increase ROAS.
              - Landing page message-match to improve conversion after the click.

              Why
              - Current performance shows wasted spend concentrated in a small set of segments; reallocating + fixing post-click friction is the fastest lever.

              Success looks like
              - Lower CAC and higher ROAS with neutral-to-positive AOV and refund rate.
            `,
          },
        },
      ],
    }
  }

  if (category === 'commerce') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel}. Identify the top 10 SKUs by revenue and the 5 SKUs with the biggest margin risk right now. Recommend actions.`,
          traces: [
            'Pulling SKU-level revenue, discounts, and COGS estimates...',
            'Ranking SKUs by revenue contribution...',
            'Detecting margin compression and promo leakage...',
            'Drafting actions by SKU tier...',
            'Ready.',
          ],
          ai: {
            text: asText`
              SKU focus summary
              - Top revenue drivers: prioritize availability, PDP quality, and ad support for these items.
              - Margin risk SKUs: discount leakage, higher returns, or increased shipping/COGS pressure.

              Recommended actions
              - Tighten promo rules on margin-risk SKUs (exclude from stacking / reduce discount depth).
              - Refresh merchandising: improve bundle/upsell on top sellers to lift AOV.
              - Flag high-return SKUs for copy/fit guidance and post-purchase education.
            `,
          },
        },
        {
          prompt: `Propose a pricing and promo strategy for the next 2 weeks that protects margin but keeps revenue stable.`,
          traces: [
            'Evaluating promo depth vs conversion tradeoffs...',
            'Drafting targeted discounts and bundles...',
            'Ready.',
          ],
          ai: {
            text: asText`
              2-week pricing/promo strategy (margin-safe)
              - Use targeted discounts (segments or bundles) instead of sitewide promos.
              - Promote bundles on high-margin SKUs; avoid discounting low-margin SKUs.
              - Add “threshold” offers (e.g., spend $X get Y) to lift AOV rather than cutting price.
              - Monitor daily: gross margin, discount rate, return rate, and conversion.
            `,
          },
        },
        {
          prompt: `Create a merchandising checklist for my daily workflow (what to check and in what order).`,
          traces: [
            'Drafting daily checks by decision priority...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Daily merchandising checklist
              1) Availability: stockouts/backorders on top 20 SKUs.
              2) Margin: promo depth and discount leakage.
              3) Returns: spikes by SKU and reason.
              4) Traffic: top landing pages and conversion breakpoints.
              5) Actions: reprioritize homepage/collections + bundles + promo rules.
            `,
          },
        },
      ],
    }
  }

  if (category === 'ops') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel}. What are the top operational risks this week (inventory, fulfillment, returns), and what should we do first?`,
          traces: [
            'Checking inventory risk (days of cover, velocity changes)...',
            'Reviewing fulfillment SLA and backlog...',
            'Analyzing return/refund trends and root causes...',
            'Drafting prioritized mitigation plan...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Top ops risks (this week)
              - Stockout risk on a small set of high-velocity SKUs.
              - Fulfillment SLA pressure during peak days (carrier variability + picking capacity).
              - Returns trending up for a specific SKU cluster (fit/expectations).

              What to do first (fastest mitigation)
              1) Expedite replenishment for top-risk SKUs and adjust reorder points.
              2) Introduce backlog triage: prioritize premium/high-risk orders + proactive customer comms.
              3) Reduce avoidable returns: PDP clarifications, sizing guidance, and targeted post-purchase messaging.
            `,
          },
        },
        {
          prompt: `Draft an inventory reorder and fulfillment plan for the next 10 days (including alerts).`,
          traces: [
            'Estimating demand and safety stock by SKU tier...',
            'Drafting reorder schedule and receiving plan...',
            'Configuring alerts for stockouts and SLA breaches...',
            'Ready.',
          ],
          ai: {
            text: asText`
              10-day ops plan (draft)
              - Inventory: reorder top sellers to cover X days; increase safety stock for weather/seasonality-sensitive items.
              - Fulfillment: add capacity for peak days; confirm carrier pickups; set SLA breach alerts.
              - Alerts: stockout forecast <7 days cover, backlog >N orders, carrier delay anomaly, return rate spike >3σ.
            `,
          },
        },
        {
          prompt: `Write the stakeholder update for leadership (risks, mitigations, and what needs approval).`,
          traces: [
            'Drafting concise leadership summary...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Leadership update (draft)
              - Risks: potential stockouts on key SKUs, fulfillment SLA pressure, and elevated returns on a small cluster.
              - Mitigations: expedite replenishment, add fulfillment capacity + triage, reduce return drivers via PDP/sizing changes.
              - Approvals needed: expedited shipping cost cap and temporary staffing budget for peak fulfillment days.
            `,
          },
        },
      ],
    }
  }

  if (category === 'customer') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel}. Summarize the top 5 drivers of support volume this week and suggest 3 deflection opportunities.`,
          traces: [
            'Reading ticket tags, contact reasons, and sentiment...',
            'Grouping themes and identifying top drivers...',
            'Estimating deflection potential...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Top contact drivers (this week)
              - Order status/shipping ETA, returns/refunds timing, promo code issues, product questions, and address changes.

              Deflection opportunities (highest leverage)
              1) Proactive order-status messaging (post-purchase + tracking page clarity).
              2) Returns eligibility + timeline self-serve flow.
              3) Promo code troubleshooting and clear rules (stacking, exclusions).

              Next: I can draft macros + automation rules to reduce handle time.
            `,
          },
        },
        {
          prompt: `Draft 5 support macros and 3 automation rules to reduce handle time and improve CSAT.`,
          traces: [
            'Drafting macros by top contact driver...',
            'Defining automation triggers and guardrails...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Macros (draft)
              1) Where is my order (WISMO) — includes ETA, tracking link, and next steps.
              2) Returns timeline — sets expectations and eligibility.
              3) Promo code not working — checklist + clear exclusions.
              4) Address change — cutoff policy + confirmation.
              5) Product question — quick spec + sizing guidance.

              Automation rules (draft)
              - Auto-tag and route WISMO; send tracking instructions immediately.
              - Detect “refund status” keywords → send timeline + status check link.
              - SLA-based escalation for high-value orders or negative sentiment.
            `,
          },
        },
        {
          prompt: `Create a weekly CX report outline I can share with leadership.`,
          traces: [
            'Organizing CX metrics and insights for leadership...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Weekly CX report outline
              - Volume + top drivers (trend vs last week)
              - CSAT / sentiment and key verbatims
              - Deflection progress (self-serve, automation)
              - Product/ops feedback loop (top bugs/process issues)
              - Action items + owners
            `,
          },
        },
      ],
    }
  }

  if (category === 'sales') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel}. Summarize pipeline health and identify the top 5 deal risks plus the next best action for each.`,
          traces: [
            'Reviewing pipeline stages, aging, and activity...',
            'Detecting stalled deals and at-risk accounts...',
            'Drafting next-best-actions by risk type...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Pipeline health summary
              - Biggest risks typically come from stalled stage progression, missing stakeholders, and unclear value/ROI narrative.

              Next best actions (examples)
              - Stalled deal: schedule mutual action plan + confirm decision date.
              - Missing champion: identify internal sponsor; tailor ROI narrative.
              - Pricing friction: propose phased rollout or bundle; anchor on outcomes.
              - Competitive threat: run a differentiation workshop; secure exec alignment.
              - No next step: send recap + 3 concrete options with times.
            `,
          },
        },
        {
          prompt: `Draft a 2-week outreach plan (cadence + messaging) for at-risk deals and renewals.`,
          traces: [
            'Designing cadence and touchpoints...',
            'Drafting message templates...',
            'Ready.',
          ],
          ai: {
            text: asText`
              2-week outreach plan
              - Week 1: value recap + mutual action plan, stakeholder mapping, and ROI artifact.
              - Week 2: executive alignment touch, objection handling, and close plan.
              - Cadence: 2 emails + 1 call + 1 social touch per week per key deal; adjust based on engagement.
            `,
          },
        },
        {
          prompt: `Write a short leadership update on pipeline risks and what you need from them.`,
          traces: [
            'Drafting concise leadership update...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Leadership update (draft)
              - Key risks: a handful of late-stage deals are stalled due to stakeholder gaps and ROI clarity.
              - Plan: mutual action plans + exec alignment touches + ROI summaries over the next 2 weeks.
              - Ask: exec sponsor for 2 strategic accounts and approval for a phased rollout option on one deal.
            `,
          },
        },
      ],
    }
  }

  if (category === 'finance') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel}. Build a profit waterfall for the last 30 days vs the prior 30 days and explain the top 3 drivers.`,
          traces: [
            'Pulling revenue, discounts, refunds, and COGS...',
            'Computing contribution margin and fixed cost deltas...',
            'Attributing variance to price, volume, mix, and costs...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Profit waterfall (summary)
              - Revenue may be flat while profit moves due to discounting, shipping costs, returns, and paid media efficiency.

              Top drivers to validate first
              1) Discount rate increased (promo depth or leakage).
              2) Shipping/carrier costs rose or more split shipments occurred.
              3) Refunds/returns increased for a small SKU set.

              Next: I can propose a margin protection plan that doesn’t sacrifice revenue.
            `,
          },
        },
        {
          prompt: `Propose a margin protection plan (next 2 weeks) with actions and expected impact.`,
          traces: [
            'Drafting actions across pricing, promos, shipping, and returns...',
            'Estimating impact ranges and monitoring metrics...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Margin protection plan (2 weeks)
              - Promo governance: reduce stacking; focus discounts on bundles/threshold offers.
              - Shipping costs: renegotiate zones, enforce packaging rules, and reduce split shipments.
              - Returns: address top reasons with PDP clarity + sizing guidance; isolate problematic SKUs.
              - Paid spend: reallocate from low-efficiency segments to protect contribution margin.

              Monitor daily
              - Gross margin, contribution margin, discount rate, shipping cost/order, return rate, CAC.
            `,
          },
        },
        {
          prompt: `Draft a concise finance readout for leadership (what changed, why, and what we’re doing).`,
          traces: [
            'Drafting leadership readout...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Finance readout (draft)
              - What changed: profit moved despite stable sales due to discounting + shipping + returns dynamics.
              - Why: mix shifted and cost per order increased in specific areas.
              - What we’re doing: tighten promo rules, reduce shipping cost/order, address return drivers, and optimize paid spend for contribution margin.
            `,
          },
        },
      ],
    }
  }

  if (category === 'risk') {
    return {
      title: `${roleLabel} Starter Session`,
      steps: [
        {
          prompt: `I’m a ${roleLabel}. Summarize fraud risk trends this week and propose 3 mitigations that minimize false positives.`,
          traces: [
            'Reviewing chargebacks, refunds, and risky patterns...',
            'Segmenting by payment method, geography, and device fingerprint...',
            'Drafting mitigations and false-positive safeguards...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Fraud risk trends (summary)
              - Watch for spikes in high-velocity orders, mismatched billing/shipping, and repeat attempts with similar fingerprints.

              Mitigations (low friction)
              1) Step-up verification only on high-risk segments (avoid blanket friction).
              2) Velocity limits + device fingerprinting for repeat attempts.
              3) Smarter rules based on historical good/bad outcomes (continuous tuning).

              Guardrails: track approval rate, conversion, and false-positive declines by segment.
            `,
          },
        },
        {
          prompt: `Draft a monitoring dashboard outline and alert thresholds for fraud and chargebacks.`,
          traces: [
            'Defining key risk metrics and thresholds...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Fraud monitoring dashboard
              - Chargeback rate, fraud loss rate, manual review rate, approval rate, and conversion.
              - Slice by payment method, country, device, and customer tenure.

              Alerts
              - Chargeback rate > baseline +3σ
              - Manual review backlog > N
              - Approval rate drops > X pts in a key segment
            `,
          },
        },
        {
          prompt: `Write a weekly fraud risk update for leadership (what changed and what we’re doing).`,
          traces: [
            'Drafting leadership update...',
            'Ready.',
          ],
          ai: {
            text: asText`
              Weekly fraud update (draft)
              - What changed: observed risk signals increased in a few segments; monitoring tightened.
              - Actions: targeted step-up verification, velocity limits, and rule tuning to reduce loss while protecting conversion.
              - Watchouts: false positives and approval-rate dips; we’re tracking segment-level guardrails daily.
            `,
          },
        },
      ],
    }
  }

  return {
    title: `${roleLabel} Starter Session`,
    steps: [
      {
        prompt: `I’m ${who} and my role is ${roleLabel}. Give me a quick command-center brief: what changed this week, what needs attention, and what to do next.`,
        traces: [
          'Pulling key KPIs and changes vs last week...',
          'Detecting anomalies and top drivers...',
          'Drafting next actions by priority...',
          'Ready.',
        ],
        ai: {
          text: asText`
            Weekly brief
            - What changed: a handful of KPI movements (acquisition efficiency, conversion, and margin) are driving outcomes.
            - Needs attention: any anomalies in spend efficiency, returns/refunds, inventory constraints, or customer sentiment.
            - Next: pick 1–2 levers to pull first, run focused tests, and monitor guardrails daily.
          `,
        },
      },
      {
        prompt: 'Turn that into a prioritized 7-day plan with owners and checkpoints.',
        traces: [
          'Breaking actions into a 7-day plan...',
          'Ready.',
        ],
        ai: {
          text: asText`
            7-day plan (draft)
            - Day 1–2: verify top drivers and fix any tracking gaps.
            - Day 2–4: execute the highest ROI change (campaign/promo/flow/process).
            - Day 4–7: run an experiment, review results, and scale winners.
            - Checkpoints: daily KPI review + anomaly alerts.
          `,
        },
      },
      {
        prompt: 'Draft a short stakeholder update I can share.',
        traces: [
          'Drafting concise stakeholder summary...',
          'Ready.',
        ],
        ai: {
          text: asText`
            Stakeholder update (draft)
            - Focus this week: address the top KPI driver(s), run targeted tests, and monitor guardrails.
            - Expected outcome: improved efficiency and stability with clear daily reporting.
          `,
        },
      },
    ],
  }
}

export function getRoleCategory(role) {
  return ROLE_CATEGORY[role] || 'default'
}

export function buildRoleSession(profile) {
  const role = profile?.role
  const category = getRoleCategory(role)
  const session = stepsFor({
    name: profile?.name,
    industry: profile?.industry,
    role,
    category,
  })
  return { ...session, category }
}

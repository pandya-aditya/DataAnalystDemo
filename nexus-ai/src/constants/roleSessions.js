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
          prompt: `Our Q4 revenue grew 18% YoY but profit margins dropped 4 points. My CMO says we over-invested in paid acquisition, but our VP of Finance thinks it's rising COGS from our new SKUs. Who's right, and where should we cut or invest heading into Q1?`,
          traces: [
            {
              summary: 'Pulled Q4 order + customer cohort data from Shopify.',
              detail: {
                dataPulled: [
                  'Shopify: order-level revenue',
                  'Shopify: channel attribution tags',
                  'Shopify: repeat purchase flags',
                  'Shopify: SKU-level revenue (Q4)',
                ],
                analysis: [
                  'Defined the outcome: decompose the 4-pt gross margin drop into drivers (mix vs unit economics).',
                  'Aligned reporting grain across sources to month (Oct/Nov/Dec).',
                ],
                output: [
                  'Monthly tables: revenue × channel/cohort and revenue × SKU.',
                ],
              },
            },
            {
              summary: 'Pulled COGS actuals vs forecast for new SKUs.',
              detail: {
                dataPulled: [
                  'AWS (COGS table): per-SKU cost of goods, fulfillment costs',
                  'COGS actuals vs forecast for 3 new SKUs',
                ],
                analysis: [
                  'Computed SKU gross margin deltas vs forecast.',
                  'Weighted COGS variance by SKU revenue contribution.',
                ],
                output: [
                  'COGS variance contribution to blended margin change.',
                ],
              },
            },
            {
              summary: 'Pulled paid media efficiency + spend by month from Meta.',
              detail: {
                dataPulled: [
                  'Meta Ads API: monthly spend (Oct/Nov/Dec)',
                  'Meta Ads API: CPM trends + ROAS by campaign',
                  'Meta: new vs retargeting split',
                ],
                analysis: [
                  'Identified month-over-month paid efficiency degradation (Nov/Dec).',
                  'Isolated paid channel mix shift vs rate changes.',
                ],
                output: [
                  'Spend series + paid-acquired gross margin series for visualization.',
                ],
              },
            },
            {
              summary: 'Validated LTV quality by acquisition source using Klaviyo cohorts.',
              detail: {
                dataPulled: [
                  'Klaviyo: revenue attribution by channel',
                  'Klaviyo: LTV estimates by acquisition cohort',
                ],
                analysis: [
                  'Compared LTV:CAC between paid vs organic cohorts.',
                  'Checked repeat purchase rate differences after controlling for AOV/category.',
                ],
                output: [
                  'Cohort quality delta: paid-acquired customers repurchase less and underperform on LTV:CAC.',
                ],
              },
            },
            {
              summary: 'Benchmarked against internal targets (OKRs) and synthesized a margin decomposition.',
              detail: {
                dataPulled: [
                  'Google Drive (Q4 OKR doc): GM target 42%',
                  'Google Drive (Q4 OKR doc): CAC payback target 4.5 months',
                ],
                analysis: [
                  'Contribution margin decomposition: mix/rate effects to attribute margin delta.',
                  'Identified primary driver: paid channel inefficiency vs secondary driver: new SKU COGS overrun.',
                ],
                output: [
                  'Attribution: ~2.6 of 4 margin points from paid inefficiency; ~1.4 from new SKU COGS overrun.',
                  'Decision: cut Meta TOF 20–25%, invest in retention/CRM, and put 60-day SKU review in place.',
                ],
              },
            },
          ],
          ai: {
            text: asText`
              Both are partially right — but your CMO has the larger problem.

              Paid acquisition (primarily Meta) drove 61% of new customer revenue in Q4, but those customers carried a 34% lower LTV-to-CAC ratio than your organic cohort, meaning you bought growth at a loss. Your 3 new SKUs are also running 11% above their COGS forecast, which accounts for roughly 1.4 of the 4 margin points lost. The remaining 2.6 points came from paid channel inefficiency — inflated CPMs in November and December and a drop in return purchase rate among paid-acquired customers.

              Your core business is healthy. The problem is allocation, not the business model.

              Recommended next steps:
              - Reduce Meta top-of-funnel spend by 20–25% in Q1 and reallocate toward Klaviyo email flows targeting your existing high-LTV segment, which converts at 3.1x the margin of paid new customers.
              - Put a 60-day review on the 3 underperforming SKUs. Either renegotiate supplier pricing or discontinue the lowest-margin variant.
              - Set a hard CAC payback threshold of 5 months before approving any paid spend increase in Q1. Your Google Drive OKR doc specifies a 4.5-month target — you're currently at 7.2.
            `,
          },
        },
        {
          prompt: `Can you model what Q1 margin looks like if we reallocate 25% of paid spend to Klaviyo retention flows?\n\n*(This is suggested prompt #2)*`,
          traces: [
            {
              summary: 'Established paid vs retention unit economics baselines for Q4 → Q1 planning.',
              detail: {
                dataPulled: [
                  'AWS (revenue + margin): gross margin by order type (new vs repeat)',
                  'AWS (revenue + margin): margin by acquisition channel',
                ],
                analysis: [
                  'Set baseline margins for the two revenue types (paid-new vs retention).',
                  'Calibrated “per dollar of spend” outcome for paid acquisition at current efficiency.',
                ],
                output: [
                  'Baseline margin delta used to forecast mix-driven margin change.',
                ],
              },
            },
            {
              summary: 'Pulled Klaviyo flow benchmarks and segment headroom constraints.',
              detail: {
                dataPulled: [
                  'Klaviyo: flow conversion rates + revenue per recipient',
                  'Klaviyo: current send cadence and segment size (high-LTV cohort)',
                  'Google Drive: brand guideline contact cap (8 emails/month)',
                ],
                analysis: [
                  'Checked capacity: current cadence (5/month) vs cap (8/month).',
                  'Established a realistic revenue ceiling for retention flows.',
                ],
                output: [
                  'Input distributions for retention lift modeling.',
                ],
              },
            },
            {
              summary: 'Modeled a counterfactual reallocation (25% Meta budget → retention flows).',
              detail: {
                dataPulled: [
                  'Meta spend baseline: quarterly reallocation amount (~$145K)',
                  'Shopify: AOV + repeat purchase frequency inputs for the retention segment',
                ],
                analysis: [
                  'Built baseline vs reallocation scenarios over 13 weeks.',
                  'Monte Carlo sensitivity using historical flow conversion variance (mean 4.2%, std 0.9%).',
                ],
                output: [
                  'Projected blended margin improvement range for Q1.',
                ],
              },
            },
            {
              summary: 'Synthesized scenario outputs into a margin trajectory with risk notes.',
              detail: {
                dataPulled: [
                  'Scenario outputs: incremental retention revenue and margin mix effect',
                ],
                analysis: [
                  'Converted incremental revenue into blended gross margin movement.',
                  'Flagged sensitivity to segment size / suppression / fatigue.',
                ],
                output: [
                  'Median margin recovery ~3.4 pts (90% CI: 3.1–3.8).',
                ],
              },
            },
          ],
          ai: {
            text: asText`
              If you reallocate 25% of your current Meta budget (~$145K quarterly) into Klaviyo retention flows targeting your top organic LTV segment, the model projects a Q1 blended gross margin improvement of 3.1 to 3.8 percentage points — nearly fully recovering the 4-point decline you saw in Q4.

              Here is what drives that recovery: Klaviyo retention flows generate revenue at near-zero marginal CAC. Your existing high-LTV segment has an average 68% gross margin on repurchase orders versus 31% on net-new paid customers. Shifting revenue mix even modestly toward retention significantly moves the blended margin. The $145K freed from Meta would have generated approximately $390K in revenue at the paid cohort's current efficiency — but at a 31% margin. That same $145K invested in Klaviyo infrastructure and offers is projected to generate $480–$520K in incremental retention revenue at a 62% margin, based on your current flow conversion benchmarks and segment size.

              The one risk: this only holds if your retention segment is not already over-messaged. Your Google Drive brand guidelines flag an 8-email-per-month contact cap — current flow cadence is at 5, so you have room.

              Recommended next steps:
              - Approve the Klaviyo flow build for the high-LTV retention segment this week — the Q1 revenue window is narrow.
              - Brief your Meta buyer to shift the freed budget to retargeting existing customers rather than zeroing it out, which preserves some paid efficiency at lower CPMs.
              - Revisit this model in week 4 of Q1 with actual flow conversion data to confirm the margin trajectory.
            `,
          },
        },
        {
          prompt: `How does this margin recovery change if our new SKU COGS problem isn't fixed in Q1?`,
          traces: [
            {
              summary: 'Pulled new SKU margin actuals vs forecast and weighted by sales volume.',
              detail: {
                dataPulled: [
                  'AWS (COGS + margin): per-SKU margin actuals for new SKUs',
                  'Shopify: SKU-level sales volume and revenue contribution (Q4)',
                ],
                analysis: [
                  'Estimated blended margin drag if COGS overrun persists into Q1.',
                  'Identified high-volume SKU(s) with the largest leverage on margin recovery.',
                ],
                output: [
                  'COGS-unresolved scenario input for Q1 margin model.',
                ],
              },
            },
            {
              summary: 'Checked whether proposed retention flows would feature the underperforming SKUs.',
              detail: {
                dataPulled: [
                  'Google Drive: Q1 Campaign Calendar (featured SKUs planned for flows)',
                  'Klaviyo: flow conversion assumptions and offer types',
                ],
                analysis: [
                  'Detected interaction effect: retention lift can be margin-diluted if flows anchor on low-margin new SKUs.',
                  'Separated independent effects vs joint interaction term (COGS × flow content).',
                ],
                output: [
                  'Decision tree across 4 scenarios (COGS fixed yes/no × SKU swap yes/no).',
                ],
              },
            },
            {
              summary: 'Ran scenario modeling and identified the dominant “fast” path.',
              detail: {
                dataPulled: [
                  'Scenario A: Reallocation + COGS fixed',
                  'Scenario B: Reallocation only (COGS unresolved)',
                  'Scenario C: Reallocation + SKU swap in flows (COGS unresolved)',
                  'Scenario D: Baseline (no changes)',
                ],
                analysis: [
                  'Quantified recovery deltas: reallocation benefit is cut ~55% if COGS is unresolved and flows feature low-margin SKUs.',
                  'Identified SKU swap as a near-optimal mitigation that does not depend on supplier renegotiation.',
                ],
                output: [
                  'Projected Q1 GM: A 38.5%, B 35.2%, C 37.8%, D 33.5%.',
                ],
              },
            },
          ],
          ai: {
            text: asText`
              If the new SKU COGS overrun is not resolved in Q1, the Klaviyo reallocation still improves your margin — but the recovery is cut roughly in half.

              Instead of recovering 3.1–3.8 points, you recover approximately 1.5–2.1 points, landing your Q1 blended gross margin in the 34–36% range versus the 38–39% range in the clean scenario. The reason is compounding: your new SKUs are being promoted in some of the same Klaviyo retention flows we are proposing to build. If those SKUs carry 31% margins and your flow offers are anchored to them (which your Q1 campaign calendar in Google Drive currently shows), the retention revenue you generate is partially margin-diluted before it even hits the blended rate.

              The practical implication is that the Klaviyo strategy and the SKU decision are not independent. You need to do one of three things before the flows launch: redirect flow offers away from the underperforming SKUs toward your highest-margin catalog items, renegotiate COGS on at least the top-volume new SKU, or accept the reduced recovery and plan a Q2 corrective.

              Of the three, redirecting flow offers to high-margin SKUs is the fastest and costs nothing. Your top 5 SKUs by margin average 58% gross margin — anchoring the retention flows to those alone recovers 2.9 points even with the COGS problem unresolved.

              Recommended next steps:
              - Immediately audit which SKUs are featured in the planned Q1 Klaviyo flows and swap any underperforming new SKUs for your top-margin catalog items.
              - Open a supplier renegotiation on your highest-volume new SKU — even a 4-point COGS reduction gets you back to the 38% margin scenario.
              - Update the Q1 campaign calendar in Google Drive to reflect the SKU swap so the broader team is aligned before flows go live.
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

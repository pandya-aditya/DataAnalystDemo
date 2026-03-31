export const CONVERSATIONS = {
  1: {
    name: "Blended CAC vs LTV Analysis",
    prompt: "Pull last 7 days blended CAC from Meta, Google, and TikTok. Compare against LTV by acquisition channel from Shopify and Klaviyo.",
    traces: [
      "Authenticating with Meta Ads API...",
      "Fetching campaign spend: 7d window...",
      "Authenticating with Google Ads API...",
      "Fetching campaign spend: 7d window...",
      "Authenticating with TikTok Ads API...",
      "Fetching campaign spend: 7d window...",
      "Querying Shopify: order history by UTM source...",
      "Querying Klaviyo: predicted LTV model (cohort: last 7d)...",
      "Mapping acquisition source to customer cohorts...",
      "Computing blended CAC per channel...",
      "Computing LTV:CAC ratio...",
      "Flagging channels where CAC > 30% of LTV...",
      "Analysis complete."
    ],
    sources: ["Meta Ads API", "Google Ads API", "TikTok Ads API", "Shopify", "Klaviyo"]
  },
  2: {
    name: "Profit Dip Root Cause",
    prompt: "I feel like I'm making less money this month even though sales look okay. What's happening?",
    traces: [
      "Querying Stripe: net revenue, last 30d vs. prior 30d...",
      "Querying Stripe: gross revenue breakdown...",
      "Querying ShipStation: shipping cost ledger, last 60d...",
      "Detecting carrier rate changes...",
      "Querying Returnly: refund rates by SKU...",
      "Identifying high-refund SKUs...",
      "Cross-referencing refund reasons from Gorgias tickets...",
      "Building profit waterfall model...",
      "Root cause analysis complete."
    ],
    sources: ["Stripe", "ShipStation", "Returnly", "Gorgias"]
  },
  3: {
    name: "Winter Collection Reorder",
    prompt: "Check stock levels for all Winter Collection items in BigQuery. Cross-reference with OpenWeather API for the Northeast US. If a cold snap is coming, increase our reorder point and draft a purchase order to our supplier.",
    traces: [
      "Authenticating with BigQuery: inventory dataset...",
      "Querying stock levels: Winter Collection (14 SKUs)...",
      "Fetching 14-day forecast: OpenWeather API (Northeast US)...",
      "Parsing forecast: temperature anomaly detected...",
      "Weather event detected: days 4–9, avg temp -18°C...",
      "Loading historical sales data: weather correlation model...",
      "Calculating demand surge probability: Heavy Parka (SKU-WC-004)...",
      "Applying 40% velocity multiplier (>3σ weather event)...",
      "Calculating stockout risk window...",
      "Drafting purchase order to supplier...",
      "Setting Slack threshold alert...",
      "Complete."
    ],
    sources: ["BigQuery", "OpenWeather API", "Slack"]
  },
  4: {
    name: "Monday Morning Briefing",
    prompt: "Give me the weekend summary. What did you do, what needs my attention, and what's the plan for this week?",
    traces: [
      "Loading weekend event log (1.2M events processed)...",
      "Summarizing autonomous actions: 4 taken...",
      "Flagging items requiring human approval: 2 found...",
      "Fetching current ROAS: Meta, Google, TikTok...",
      "Computing blended ROAS vs. 4:1 target...",
      "Pulling AOV, CPA, CVR from Shopify + GA4...",
      "Loading Q3 acquisition goal progress...",
      "Building briefing...",
      "Ready."
    ],
    sources: ["Meta Ads", "Google Ads", "TikTok Ads", "Shopify", "GA4"]
  }
}

export const INTEGRATIONS = [
  { name: "Shopify",      abbr: "SH",  cat: "finance",    connected: true  },
  { name: "GA4",          abbr: "GA4", cat: "marketing",  connected: true  },
  { name: "Klaviyo",      abbr: "KL",  cat: "marketing",  connected: true  },
  { name: "BigQuery",     abbr: "BQ",  cat: "finance",    connected: true  },
  { name: "Meta Ads",     abbr: "MT",  cat: "marketing",  connected: true  },
  { name: "Google Ads",   abbr: "GG",  cat: "marketing",  connected: true  },
  { name: "TikTok Ads",   abbr: "TT",  cat: "marketing",  connected: true  },
  { name: "Stripe",       abbr: "ST",  cat: "finance",    connected: true  },
  { name: "ShipStation",  abbr: "SS",  cat: "logistics",  connected: true  },
  { name: "Slack",        abbr: "SL",  cat: "support",    connected: true  },
  { name: "Gorgias",      abbr: "GR",  cat: "support",    connected: true  },
  { name: "AfterShip",    abbr: "AS",  cat: "logistics",  connected: true  },
  { name: "Google Drive", abbr: "GD",  cat: "logistics",  connected: true  },
  { name: "Gmail",        abbr: "GM",  cat: "logistics",  connected: true  },
  { name: "Sharepoint",   abbr: "SP",  cat: "logistics",  connected: true  },
  { name: "AWS",          abbr: "AWS", cat: "finance",    connected: false },
  { name: "Azure",        abbr: "AZ",  cat: "finance",    connected: false },
  { name: "PayPal",       abbr: "PP",  cat: "finance",    connected: false },
  { name: "NetSuite",     abbr: "NS",  cat: "finance",    connected: false },
  { name: "Zendesk",      abbr: "ZD",  cat: "support",    connected: false },
  { name: "Returnly",     abbr: "RT",  cat: "logistics",  connected: true  },
  { name: "Attentive",    abbr: "AT",  cat: "marketing",  connected: false },
  { name: "ReCharge",     abbr: "RC",  cat: "finance",    connected: false },
  { name: "Yotpo",        abbr: "YT",  cat: "marketing",  connected: false },
  { name: "Postscript",   abbr: "PS",  cat: "marketing",  connected: false },
  { name: "Loop Returns", abbr: "LP",  cat: "logistics",  connected: false },
  { name: "Skubana",      abbr: "SK",  cat: "logistics",  connected: false },
]

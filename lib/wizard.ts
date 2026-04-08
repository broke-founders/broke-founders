export const CATEGORIES = [
  "Consumer App",
  "B2B SaaS", 
  "Marketplace",
  "AI Tool / Agent",
  "Automation Workflow",
  "Website / Landing Page",
  "E-commerce Store",
  "Content Platform",
  "Service Business",
  "Hardware / IoT",
  "Other"
]

export const BACKGROUNDS = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Brand Designer",
  "Product Manager",
  "Growth / Marketer",
  "Content Writer",
  "SEO Specialist",
  "AI / ML Engineer",
  "Domain Expert",
  "Non-technical Founder",
  "Other"
]

export const CURRENT_STATE = [
  "Just an idea",
  "Have mockups / wireframes",
  "Have a working prototype",
  "Have early users",
]

export const TARGET_MARKET = ["B2C", "B2B", "Both"]

export type SuggestedNode = {
  role: string
  description: string
  skills_needed: string[]
  slice: number
  hours_estimate: number
  milestone: string
}

const SUGGESTIONS: Record<string, SuggestedNode[]> = {
  "Consumer App": [
    { role:"Full Stack Developer", description:"Build the core product — frontend, backend, database, deployment.", skills_needed:["React","Node.js","PostgreSQL"], slice:25, hours_estimate:120, milestone:"Working MVP with auth and core feature" },
    { role:"UI/UX Designer", description:"Design the user experience — flows, screens, design system.", skills_needed:["Figma","User Research","Prototyping"], slice:15, hours_estimate:60, milestone:"Complete design system and all core screens" },
    { role:"Growth Marketer", description:"Acquire first 100 users. Own the distribution strategy.", skills_needed:["SEO","Content Marketing","Community"], slice:10, hours_estimate:40, milestone:"100 active users within 60 days of launch" },
    { role:"Copywriter", description:"Write all product copy — landing page, onboarding, emails.", skills_needed:["UX Writing","Email Copy","Landing Pages"], slice:5, hours_estimate:20, milestone:"Full landing page copy and onboarding flow" },
  ],
  "B2B SaaS": [
    { role:"Full Stack Developer", description:"Build the product — multi-tenant architecture, billing, dashboard.", skills_needed:["Next.js","PostgreSQL","Stripe"], slice:25, hours_estimate:150, milestone:"Working MVP with billing and team features" },
    { role:"UI/UX Designer", description:"Design a professional SaaS UI. B2B buyers judge on design.", skills_needed:["Figma","SaaS Design Patterns","Dashboard Design"], slice:15, hours_estimate:60, milestone:"Full dashboard design ready for development" },
    { role:"Content Writer", description:"SEO content, case studies, and documentation to drive inbound.", skills_needed:["Technical Writing","SEO","Case Studies"], slice:10, hours_estimate:40, milestone:"10 SEO articles and full documentation" },
    { role:"Market Researcher", description:"Validate ICP, map competitors, find positioning.", skills_needed:["Market Research","Competitive Analysis","ICP Definition"], slice:5, hours_estimate:20, milestone:"Validated ICP and positioning document" },
  ],
  "Marketplace": [
    { role:"Full Stack Developer", description:"Build the two-sided marketplace — listings, payments, trust systems.", skills_needed:["React","Node.js","Stripe Connect","PostgreSQL"], slice:25, hours_estimate:160, milestone:"Working marketplace with listings and payments" },
    { role:"UI/UX Designer", description:"Design trust-building UX for both sides of the marketplace.", skills_needed:["Figma","Marketplace UX","Mobile Design"], slice:15, hours_estimate:70, milestone:"Complete buyer and seller flows designed" },
    { role:"Growth Marketer", description:"Solve the cold start problem. Acquire first supply and demand.", skills_needed:["Community Building","SEO","Partnerships"], slice:10, hours_estimate:50, milestone:"50 listings and 100 registered buyers" },
  ],
  "AI Tool / Agent": [
    { role:"AI/ML Engineer", description:"Build and fine-tune the AI core — models, prompts, pipelines.", skills_needed:["Python","LangChain","OpenAI API","Vector DBs"], slice:25, hours_estimate:120, milestone:"Working AI pipeline with < 2s response time" },
    { role:"Full Stack Developer", description:"Build the product wrapper — UI, API, auth, billing.", skills_needed:["Next.js","FastAPI","PostgreSQL"], slice:20, hours_estimate:100, milestone:"Production-ready app with billing" },
    { role:"UI/UX Designer", description:"Design AI interaction patterns — prompts, outputs, feedback loops.", skills_needed:["Figma","AI UX Patterns","Prototyping"], slice:10, hours_estimate:40, milestone:"Complete interaction design for all AI flows" },
    { role:"Copywriter", description:"Landing page, onboarding copy, and prompt templates.", skills_needed:["AI Copywriting","Landing Pages","UX Writing"], slice:5, hours_estimate:20, milestone:"Full site copy and onboarding written" },
  ],
  "Automation Workflow": [
    { role:"Automation Specialist", description:"Build the core workflows in n8n, Make, or custom code.", skills_needed:["n8n","Make","Zapier","API Integrations"], slice:25, hours_estimate:80, milestone:"Core automation workflow live and tested" },
    { role:"Backend Developer", description:"Build custom integrations and API connectors.", skills_needed:["Node.js","REST APIs","Webhooks"], slice:20, hours_estimate:80, milestone:"All integrations connected and documented" },
    { role:"Copywriter", description:"Explain complex automation simply. Write docs and landing page.", skills_needed:["Technical Writing","Landing Pages"], slice:5, hours_estimate:20, milestone:"Landing page and full documentation written" },
  ],
  "Website / Landing Page": [
    { role:"Frontend Developer", description:"Build a fast, beautiful, conversion-optimised website.", skills_needed:["Next.js","Tailwind","Animation","Performance"], slice:25, hours_estimate:60, milestone:"Live website scoring 90+ on PageSpeed" },
    { role:"Copywriter", description:"Write all copy — headline, value prop, CTAs, about page.", skills_needed:["Conversion Copywriting","SEO Writing","Brand Voice"], slice:15, hours_estimate:30, milestone:"All page copy written and approved" },
    { role:"SEO Specialist", description:"Technical SEO, keyword strategy, and content plan.", skills_needed:["Technical SEO","Keyword Research","Content Strategy"], slice:10, hours_estimate:30, milestone:"Site ranking for 5 target keywords in 90 days" },
    { role:"Brand Designer", description:"Logo, color system, typography, brand guidelines.", skills_needed:["Logo Design","Brand Identity","Figma"], slice:10, hours_estimate:30, milestone:"Complete brand guidelines delivered" },
  ],
  "E-commerce Store": [
    { role:"Frontend Developer", description:"Build the store — product pages, cart, checkout, performance.", skills_needed:["Shopify","Next.js","Conversion Optimization"], slice:20, hours_estimate:80, milestone:"Store live with full purchase flow" },
    { role:"Copywriter", description:"Product descriptions, email sequences, ad copy.", skills_needed:["E-commerce Copy","Email Marketing","Ad Copy"], slice:15, hours_estimate:40, milestone:"All product copy and 5-email welcome sequence" },
    { role:"Paid Ads Specialist", description:"Run and optimise Meta and Google ads for first sales.", skills_needed:["Meta Ads","Google Ads","Analytics"], slice:10, hours_estimate:30, milestone:"First 50 sales from paid channels" },
    { role:"Brand Designer", description:"Product photography direction, brand visual identity.", skills_needed:["Brand Identity","Visual Direction","Figma"], slice:10, hours_estimate:30, milestone:"Complete brand assets delivered" },
  ],
  "Content Platform": [
    { role:"Backend Developer", description:"Build the platform — CMS, user accounts, content delivery.", skills_needed:["Node.js","PostgreSQL","CDN","CMS"], slice:25, hours_estimate:120, milestone:"Platform live with content upload and playback" },
    { role:"Content Writer", description:"Seed the platform with founding content. Set the standard.", skills_needed:["Content Strategy","Long-form Writing","SEO"], slice:15, hours_estimate:60, milestone:"20 pieces of founding content published" },
    { role:"SEO Specialist", description:"Drive organic traffic to content pages.", skills_needed:["Content SEO","Link Building","Technical SEO"], slice:10, hours_estimate:40, milestone:"1000 monthly organic visitors in 90 days" },
    { role:"Community Manager", description:"Build the audience. Moderate, engage, grow.", skills_needed:["Community Building","Social Media","Discord"], slice:10, hours_estimate:40, milestone:"500 registered members and active community" },
  ],
  "Service Business": [
    { role:"Copywriter", description:"Write the pitch, service pages, proposals, and case studies.", skills_needed:["B2B Copywriting","Proposals","Case Studies"], slice:20, hours_estimate:40, milestone:"Full service site copy and 3 case studies" },
    { role:"SEO Specialist", description:"Drive inbound leads through organic search.", skills_needed:["Local SEO","Service SEO","Content Marketing"], slice:15, hours_estimate:40, milestone:"Ranking for 3 target service keywords" },
    { role:"Sales Specialist", description:"Outbound outreach and pipeline management.", skills_needed:["Cold Outreach","CRM","Sales Process"], slice:15, hours_estimate:50, milestone:"10 qualified discovery calls booked" },
    { role:"Brand Designer", description:"Professional brand identity that builds trust.", skills_needed:["Logo Design","Brand Identity","Pitch Deck Design"], slice:10, hours_estimate:30, milestone:"Full brand kit and pitch deck delivered" },
  ],
  "Hardware / IoT": [
    { role:"Embedded Developer", description:"Build the firmware and hardware integration layer.", skills_needed:["C/C++","Arduino","Raspberry Pi","MQTT"], slice:25, hours_estimate:150, milestone:"Working prototype with stable firmware" },
    { role:"Mobile Developer", description:"Build the companion app for iOS and Android.", skills_needed:["React Native","Bluetooth","IoT Protocols"], slice:20, hours_estimate:100, milestone:"App live on both stores connecting to device" },
    { role:"UI/UX Designer", description:"Design both the physical product UX and the app.", skills_needed:["Industrial Design","Mobile UX","Figma"], slice:15, hours_estimate:60, milestone:"Complete app and hardware UX designed" },
    { role:"Market Researcher", description:"Validate demand, map competitors, define go-to-market.", skills_needed:["Hardware Market Research","Regulatory Research","Pricing"], slice:5, hours_estimate:20, milestone:"Validated market size and GTM strategy" },
  ],
  "Other": [
    { role:"Full Stack Developer", description:"Build the core product.", skills_needed:["Web Development"], slice:25, hours_estimate:100, milestone:"Working MVP" },
    { role:"UI/UX Designer", description:"Design the user experience.", skills_needed:["Figma","UX Design"], slice:15, hours_estimate:50, milestone:"Complete design system" },
    { role:"Growth Marketer", description:"Acquire first users.", skills_needed:["Marketing","Growth"], slice:10, hours_estimate:30, milestone:"First 100 users" },
  ],
}

export function getSuggestions(category: string, background: string): SuggestedNode[] {
  const base = SUGGESTIONS[category] || SUGGESTIONS["Other"]
  // Remove the node that matches the originator's background
  return base.filter(node => !node.role.toLowerCase().includes(background.toLowerCase().split(" ")[0]))
}

export function adjustSlicesForStake(nodes: SuggestedNode[], originatorStake: number): SuggestedNode[] {
  const available = 100 - originatorStake
  const totalSuggested = nodes.reduce((s, n) => s + n.slice, 0)
  if (totalSuggested === 0) return nodes
  return nodes.map(n => ({
    ...n,
    slice: Math.round((n.slice / totalSuggested) * available)
  }))
}
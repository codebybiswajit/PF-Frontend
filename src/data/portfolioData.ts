import type { PortfolioProject } from '../types';

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'ecomm',
    title: 'E-Commerce Platform',
    desc: 'A production-grade online shopping platform with real-time inventory, payment processing, and admin dashboard.',
    emoji: '🛒',
    badge: 'FULL STACK',
    bgClass: 'bg-ecomm',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    features: [
      { title: 'Auth System', body: 'JWT-based login, OAuth2 (Google/GitHub), role-based access (admin, seller, buyer)' },
      { title: 'Product Catalog', body: 'Advanced search with Elasticsearch, filters, categories, and variants' },
      { title: 'Shopping Cart', body: 'Persistent cart with Redis, wishlist, saved-for-later functionality' },
      { title: 'Payment', body: 'Stripe integration, multiple currencies, refunds, and invoicing' },
      { title: 'Admin Dashboard', body: 'Real-time analytics, inventory alerts, order management' },
      { title: 'Performance', body: 'Redis caching, CDN assets, lazy-loading, Lighthouse 95+' },
    ],
    tech: ['React 18', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Stripe API', 'Docker', 'AWS S3', 'Elasticsearch', 'JWT'],
    stack: `GET /api/products?category=electronics&sort=price\n> 200 OK | 48ms | 124 products returned\n\nPOST /api/cart/add { productId: "px-284", qty: 2 }\n> 200 OK | Cart updated | Total: $149.98\n\nPOST /api/orders/checkout\n> 201 Created | Order #ORD-2024-8821 | Payment: ✓`,
  },
  {
    id: 'hospital',
    title: 'Hospital Management System',
    desc: 'End-to-end hospital operations: patient records, appointment scheduling, billing, and staff management with HIPAA compliance.',
    emoji: '🏥',
    badge: 'ENTERPRISE',
    badgeColor: 'warning',
    bgClass: 'bg-hospital',
    tags: ['Django', 'React', 'MySQL', 'Docker', 'REST API'],
    features: [
      { title: 'Patient Records', body: 'Complete EHR system with medical history, diagnoses, prescriptions' },
      { title: 'Appointments', body: 'Smart scheduling with conflict detection, doctor availability, reminders' },
      { title: 'Billing & Insurance', body: 'Automated billing, insurance claim processing, payment tracking' },
      { title: 'Lab Integration', body: 'Lab result uploads, test ordering, and result notifications' },
      { title: 'Staff Management', body: 'Roles, shifts, attendance tracking for doctors/nurses/admin' },
      { title: 'HIPAA Compliance', body: 'End-to-end encryption, audit logs, access controls' },
    ],
    tech: ['Django', 'Django REST', 'React', 'MySQL', 'Celery', 'Redis', 'Docker', 'WebSockets', 'PDF generation', 'HIPAA'],
    stack: `Patient: John Doe | DOB: 1980-03-15 | ID: PAT-4821\nDiagnosis: Hypertension (ICD-10: I10)\nPrescribed: Lisinopril 10mg | Dr. Smith\n\nAppointment: 2024-01-20 10:30 AM ✓ Confirmed\nBilling: $250.00 | Insurance: $200 | Patient: $50`,
  },
  {
    id: 'scraper',
    title: 'Python Web Scraping Engine',
    desc: 'Distributed Python web scraping framework with smart scheduling, proxy rotation, data normalization and analytics pipeline.',
    emoji: '🕷️',
    badge: 'PYTHON',
    badgeColor: 'pink',
    bgClass: 'bg-scraper',
    tags: ['Python', 'Scrapy', 'Selenium', 'Kafka', 'MongoDB'],
    features: [
      { title: 'Distributed Crawling', body: 'Multi-node Scrapy cluster with Kafka queue and Redis deduplication' },
      { title: 'Anti-Detection', body: 'Proxy rotation, user-agent spoofing, request throttling, header randomization' },
      { title: 'CAPTCHA Handling', body: '2Captcha API integration with fallback Selenium for JS-heavy pages' },
      { title: 'Data Pipeline', body: 'Scrapy pipelines → Kafka → MongoDB with schema validation' },
      { title: 'Monitoring', body: 'Real-time dashboard: crawl speed, success rate, proxy health' },
      { title: 'Scheduling', body: 'Cron-based scheduling, priority queues, domain rate limiting' },
    ],
    tech: ['Python 3.11', 'Scrapy', 'Selenium', 'Playwright', 'Kafka', 'MongoDB', 'Redis', 'Docker', 'Grafana', 'BeautifulSoup'],
    stack: `[CRAWLER] Starting job: ecommerce_prices\nProxies: 145 active | Rotating every 50 requests\nQueue: 12,480 URLs | Speed: 340 req/min\n\n✓ Extracted: 8,240 products | 2.1s avg\n✓ Stored → MongoDB: prices_2024_01\nPipeline: Validated → Deduplicated → Saved`,
  },
];

export const SITE_INFO = {
  founderName: 'Alex Johnson',
  founderTitle: 'Full Stack Developer & Data Engineer',
  founderInitials: 'AJ',
  logoText: 'AJ.DEV',
  tagline: 'FULL STACK DEVELOPER & DATA ENGINEER',
  bio: `I'm a passionate developer who thrives on solving complex problems with clean, efficient code. With expertise spanning frontend design, backend architecture, and data engineering, I build systems that scale and experiences that delight.`,
  bio2: `My three flagship projects span e-commerce, healthcare, and data engineering — each built to production standards with real-world constraints in mind.`,
  stats: [
    { num: '3+', label: 'Major Projects' },
    { num: '5+', label: 'Years Coding' },
    { num: '15+', label: 'Technologies' },
    { num: '100%', label: 'Passion' },
  ],
};

export const PUBLIC_CHAT_QA: { patterns: string[]; answer: string }[] = [
  {
    patterns: ['who is founder', 'founder', 'who made', 'who created', 'who built', 'owner'],
    answer: `The founder of this website is **Alex Johnson** — a Full Stack Developer & Data Engineer with expertise in React, Node.js, Python, and data pipelines. Alex built this portfolio platform to showcase his work and allow others to generate their own ATS-friendly resumes!`,
  },
  {
    patterns: ['what can', 'what does', 'features', 'capabilities', 'do'],
    answer: `This portfolio platform lets you:\n\n• 🚀 **Browse Alex's projects** — E-Commerce, Hospital Management, Web Scraper\n• 📄 **Generate your own ATS resume** — Sign up and fill in your details\n• 🤖 **Chat with AI** — Ask anything about the portfolio or tech\n• 🔐 **Authenticated experience** — Log in to access your personalized resume and full AI chat`,
  },
  {
    patterns: ['projects', 'portfolio', 'work', 'built'],
    answer: `Alex has 3 major projects:\n\n1. **E-Commerce Platform** — Full-stack shopping platform with Stripe payments, Redis caching, React + Node.js\n2. **Hospital Management System** — HIPAA-compliant EHR system with Django + React + MySQL\n3. **Python Web Scraping Engine** — Distributed scraper with Scrapy, Kafka, MongoDB and proxy rotation`,
  },
  {
    patterns: ['tech', 'technology', 'stack', 'skills', 'languages'],
    answer: `Alex works with a broad tech stack:\n\n• **Frontend**: React, Next.js, TypeScript, Bootstrap\n• **Backend**: Node.js/Express, Python/Django, .NET\n• **Databases**: PostgreSQL, MySQL, MongoDB, Redis\n• **DevOps**: Docker, Kubernetes, AWS\n• **Data**: Scrapy, Kafka, Elasticsearch`,
  },
  {
    patterns: ['resume', 'cv', 'ats'],
    answer: `This site auto-generates an **ATS-friendly resume** from your profile! Sign up, fill in your education, experience, and projects — and we'll produce a clean, professional resume ready for download as PDF. 📄`,
  },
  {
    patterns: ['contact', 'hire', 'reach', 'email'],
    answer: `To get in touch with Alex Johnson, you can check his LinkedIn and GitHub profiles listed on the About page. For a more personalized interaction, sign in and use the AI Chat feature! 💬`,
  },
  {
    patterns: ['hello', 'hi', 'hey', 'greetings'],
    answer: `Hey there! 👋 I'm Alex's AI assistant. I can answer questions about this portfolio, Alex's projects, tech stack, or how the site works — all without you needing to log in! Ask me anything.`,
  },
];

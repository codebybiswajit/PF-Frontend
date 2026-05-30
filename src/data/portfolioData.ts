import type { PortfolioProject, ResumeData } from '../types';

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
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'JWT'],
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
    tags: ['React', 'MongoDB', 'REST API'],
    features: [
      { title: 'Patient Records', body: 'Complete EHR system with medical history, diagnoses, prescriptions' },
      { title: 'Appointments', body: 'Smart scheduling with conflict detection, doctor availability, reminders' },
      { title: 'Billing & Insurance', body: 'Automated billing, insurance claim processing, payment tracking' },
      { title: 'Lab Integration', body: 'Lab result uploads, test ordering, and result notifications' },
      { title: 'Staff Management', body: 'Roles, shifts, attendance tracking for doctors/nurses/admin' },
    ],
    tech: ['React', 'MongoDB', 'WebSockets', 'PDF generation'],
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
    tags: ['Python', 'Selenium', 'MongoDB'],
    features: [
      { title: 'Distributed Crawling', body: 'Multi-node Scrapy cluster with Kafka queue and Redis deduplication' },
      { title: 'Anti-Detection', body: 'Proxy rotation, user-agent spoofing, request throttling, header randomization' },
      { title: 'CAPTCHA Handling', body: '2Captcha API integration with fallback Selenium for JS-heavy pages' },
      { title: 'Monitoring', body: 'Real-time dashboard: crawl speed, success rate, proxy health' },
      { title: 'Scheduling', body: 'Cron-based scheduling, priority queues, domain rate limiting' },
    ],
    tech: ['Python 3.11', 'Selenium', 'Playwright', 'MongoDB', 'BeautifulSoup'],
    stack: `[CRAWLER] Starting job: ecommerce_prices\nProxies: 145 active | Rotating every 50 requests\nQueue: 12,480 URLs | Speed: 340 req/min\n\n✓ Extracted: 8,240 products | 2.1s avg\n✓ Stored → MongoDB: prices_2024_01\nPipeline: Validated → Deduplicated → Saved`,
  },
];

export const SITE_INFO = {
  founderName: 'Biswajit Mohapatra',
  founderTitle: 'Full Stack Developer & Data Engineer',
  founderInitials: 'BM',
  logoText: 'BM.DEV',
  tagline: 'FULL STACK DEVELOPER & DATA ENGINEER',
  bio: `I'm a passionate developer who thrives on solving complex problems with clean, efficient code. With expertise spanning frontend design, backend architecture, and data engineering, I build systems that scale and experiences that delight.`,
  bio2: `My three flagship projects span e-commerce, healthcare, and data engineering — each built to production standards with real-world constraints in mind.`,
  stats: [
    { num: '3+', label: 'Major Projects' },
    { num: '1.5+', label: 'Years Coding' },
    { num: '15+', label: 'Technologies' },
    { num: '100%', label: 'Passion' },
  ],
};

export const PUBLIC_CHAT_QA: { patterns: string[]; answer: string }[] = [
  {
    patterns: ['founder', 'founder', 'who made you', 'who created you', 'who built', 'owner'],
    answer: `The founder of this website is **Biswajit Mohapatra** — a Full Stack Developer & Data Engineer with expertise in React, Node.js, Python, and data pipelines. Biswajit built this portfolio platform to showcase his work and allow others to generate their own ATS-friendly resumes!`,
  },
  {
    patterns: ['what can', 'what does', 'features', 'capabilities', 'do'],
    answer: `This portfolio platform lets you:\n\n• 🚀 **Browse Biswajits's projects** — E-Commerce, Hospital Management, Web Scraper\n• 📄 **Generate your own ATS resume** — Sign up and fill in your details\n• 🤖 **Chat with AI** — Ask anything about the portfolio or tech\n• 🔐 **Authenticated experience** — Log in to access your personalized resume and full AI chat`,
  },
  {
    patterns: ['projects', 'portfolio', 'work', 'built'],
    answer: `Biswajit has 3 major projects:\n\n1. **E-Commerce Platform** — Full-stack shopping platform with Stripe payments, Redis caching, React + Node.js\n2. **Hospital Management System** — HIPAA-compliant EHR system with Django + React + MySQL\n3. **Python Web Scraping Engine** — Distributed scraper with Scrapy, Kafka, MongoDB and proxy rotation`,
  },
  {
    patterns: ['tech', 'technology', 'stack', 'skills', 'languages'],
    answer: `Biswajit works with a broad tech stack:\n\n• **Frontend**: React, Next.js, TypeScript, Bootstrap\n• **Backend**: Node.js/Express, Python/Django, .NET\n• **Databases**: PostgreSQL, MySQL, MongoDB, Redis\n• **DevOps**: Docker, Kubernetes, AWS\n• **Data**: Scrapy, Kafka, Elasticsearch`,
  },
  {
    patterns: ['resume', 'cv', 'ats'],
    answer: `This site auto-generates an **ATS-friendly resume** from your profile! Sign up, fill in your education, experience, and projects — and we'll produce a clean, professional resume ready for download as PDF. 📄`,
  },
  {
    patterns: ['contact', 'hire', 'reach', 'email'],
    answer: `To get in touch with Biswajit Mohapatra, you can check his LinkedIn and GitHub profiles listed on the About page. For a more personalized interaction, sign in and use the AI Chat feature! 💬`,
  },
  {
    patterns: ['hello', 'hi', 'hey', 'greetings'],
    answer: `Hey there! 👋 I'm Biswajits's AI assistant. I can answer questions about this portfolio, Biswajit's projects, tech stack, or how the site works — all without you needing to log in! Ask me anything.`,
  },
];

export const RESUME_DATA: ResumeData = {
  firstName: 'Biswajit',
  lastName: 'Mohapatra',
  title: 'Full Stack Developer & Data Engineer',

  contact: {
    email: 'biswajitmohapatra447@example.com',
    phone: '+91 8018035461',
    location: 'Bhubaneswar, Odisha, India',
    website: 'biswajit-mohapatra-portfolio.onrender.com',
    linkedin: 'linkedin.com/in/biswajitmohapatra1',
    github: 'github.com/codebybiswajit',
    // twitter: '@biswajit_dev',
  },

  summary:
    'Passionate Full Stack Developer & Data Engineer with 1.55+ years of experience ' +
    'building production-grade web applications and distributed data systems. ' +
    'Skilled across the entire stack — from pixel-perfect React UIs to robust ' +
    'Node.js APIs, MongoDB schemas data pipelines. ' +
    'high-throughput scraping engines, and scalable e-commerce platforms.',

  skillGroups: [
    {
      category: 'Frontend',
      icon: '🎨',
      skills: ['React 20', 'Next.js', 'TypeScript', 'CSS / Tailwind', 'Framer Motion', 'Bootstrap'],
    },
    {
      category: 'Backend',
      icon: '⚙️',
      skills: ['Node.js', 'Express', 'Python'],
    },
    {
      category: 'Databases',
      icon: '🗄️',
      skills: ['MongoDB', 'MySQL'],
    },
    {
      category: 'Data & Scraping',
      icon: '📊',
      skills: ['Selenium', 'BeautifulSoup'],
    },
    {
      category: 'DevOps & Cloud',
      icon: '☁️',
      skills: ['GitHub Actions'],
    },
    {
      category: 'Tools & Others',
      icon: '🔧',
      skills: ['Git', 'Stripe API', 'JWT / OAuth2', 'WebSockets', 'Linux'],
    },
  ],

  education: [
    {
      degree: 'Bachelor of Technology',
      field: 'Computer Science & Engineering',
      institution: 'Nalanda institute of technology',
      location: 'Bhubaneswar, Odisha',
      start: '2021',
      end: '2025',
      gpa: '8.06 / 10',
      honors: 'First Class with Distinction',
      courses: [
        'Data Structures & Algorithms',
        'Database Management Systems',
        'Computer Networks',
        'Operating Systems',
        'Software Engineering',
        'Computer Organization and Architecture',
      ],
    },
  ],

  experience: [
    {
      title: 'Full Stack Developer',
      company: 'Capsitech Software Solution Pvt. Ltd.',
      location: 'Jodhpur, Rajasthan, India',
      type: 'Full-time',
      start: 'JUN 2026',
      end: 'Present',
      summary: 'Working on the UK tax filing system in collaboration with the Acting Office and HMRC.',
      bullets: [
        "Integrated secure bank connection into SA100 data requests, enabling automated retrieval of financial records for individual tax filings.",
        "Engineered enhancements to the UK Individual (SA100) and Partnership (SA800) tax systems within the Acting Office, improving accuracy and compliance workflows.",
        "Developed and optimized P11D data request functionality, streamlining employer reporting of employee benefits and expenses.",
        "Collaborated with HMRC and the Acting Office to modernize tax filing processes, reducing manual intervention and strengthening system reliability.",
        "Implemented microservice architecture for both frontend and backend, improving scalability, enabling independent deployments, and reducing system downtime."
      ],
      tech: ['React', 'Type Script', 'ASP.Net Core', 'MongoDB', 'Azure', 'Fluent UI', 'Azure Blob Storage', 'X-Unit Testing .Net', 'Jest React Testing Library'],
    },
    {
      title: 'Python Developer Intern',
      company: 'CodeSoft',
      location: 'Remote',
      type: 'Internship',
      start: 'OCT 2023',
      end: 'NOV 2023',
      bullets: [
        'Built real-time monitoring dashboards using Python to track crawler health, proxy rotation, and data quality metrics.',
        'Reduced data duplication by 35% with BeautifulSoup-powered parsing and Python-based deduplication logic across consumer pipelines.'
      ],
      tech: ['Python', 'BeautifulSoup'],
    },
  ],

  projects: [
    {
      name: 'E-Commerce Platform',
      tagline: 'Production-grade shopping platform with real-time inventory & payments',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
      desc: 'Full-stack e-commerce solution with JWT/OAuth2 auth, Elasticsearch product search, persistent Redis cart, Stripe payments, and a real-time admin dashboard.',
      repo: 'github.com/biswajitmohapatra/ecommerce',
      highlights: [
        'Introduced a basket feature tailored for organic vegetables, improving user convenience and boosting repeat purchases.',
        'Implemented analytics to identify the most frequently purchased products, helping users make informed buying decisions and aiding inventory planning.',
        'Designed a review‑based ranking system where top‑rated products surface first, increasing customer trust and engagement.',
        'Enhanced checkout experience with multi‑currency support and automated refunds, ensuring seamless transactions across regions.',
      ],
    },
    {
      name: 'Hospital Management System',
      // tagline: 'HIPAA-compliant EHR & operations platform for healthcare providers',
      tech: ['Node.js', 'Express', 'React', 'MySQL', 'Redis', 'WebSockets'],
      desc: 'End-to-end hospital operations platform: patient records (EHR), smart appointment scheduling, automated billing & insurance claims, lab integrations, and HIPAA-grade security.',
      repo: 'github.com/biswajitmohapatra/hms',
      highlights: [
        'End-to-end AES-256 encryption on all PHI data',
        'Real-time appointment notifications via WebSockets',
        'Supports 50+ concurrent doctors and 500+ daily patient records',
      ],
    },
    {
      name: 'Python Web Scraping Engine',
      tagline: 'Distributed scraping framework with anti-detection & analytics pipeline', // optional
      tech: ['Python', 'Scrapy', 'Selenium', 'Playwright', 'Kafka', 'MongoDB', 'Redis', 'Grafana'],
      desc: 'Multi-node Scrapy cluster with Kafka queue, proxy rotation, CAPTCHA solving, request fingerprint randomization, and a real-time Grafana monitoring dashboard.',
      repo: 'github.com/biswajitmohapatra/scraper', // optional — TODO: update
      highlights: [
        'Built real-time monitoring dashboards using Python to track crawler health, proxy rotation, and data quality metrics.',
        'Reduced data duplication by 35% with BeautifulSoup-powered parsing and Python-based deduplication logic across consumer pipelines.',
      ],
    },
  ],

  // ── Optional ────────────────────────────────────────────────────
  tagline: 'Building systems that scale & experiences that delight.',

  certifications: [
    {
      name: 'AI Appreciate & AI Aware Badge',
      issuer: 'CBSE and Intel',
      date: 'AUG 2023',
      credentialId: '1',
      url: 'https://ai-for-all.in/#/badge?id=U2FsdGVkX18WAlDeUADw21Cp1L2u3SeUODjPKp1L2u3Soms1L2a3S4hoQC7Ok5U7wbbU4ose6yb1EbaRvuKg',
    },
    {
      name: 'Python  ',
      issuer: 'Hacker Rank',
      date: '28 JAN 2024',
      credentialId: '2c150edbd7c5',
      url: 'https://www.hackerrank.com/certificates/2c150edbd7c5',
    },
  ],

  languages: [
    { language: 'English', proficiency: 'Professional' },
    { language: 'Hindi', proficiency: 'Fluent' },
    { language: 'Odia', proficiency: 'Native' },
  ],

  interests: ['Open Source', 'Competitive Programming', 'Tech Blogging'],

  openToWork: true,
  availableFrom: 'Immediately',
};

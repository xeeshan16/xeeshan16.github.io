// Everything about you that isn't a case study lives here.
// Edit this file to update the home page; case studies live in src/content/work/.

export const profile = {
  name: 'Zeeshan Imdad',
  role: 'Lead Backend Engineer',
  employer: 'ADCB',
  location: 'Abu Dhabi, UAE',
  headline: 'Backend systems for payments, event streaming and agentic AI.',
  intro:
    "I lead a team of six backend engineers at ADCB, where I own the card and wallet payment services and the multi-agent AI Operations Copilot that on-call engineers use during live incidents. Before that I built high-throughput observability services at SolarWinds, banking integrations at Publicis Sapient, and a telemetry ingestion pipeline at Wipro. I work mostly in Java and Kotlin with Spring Boot, plus Go and Python.",
  availability: 'Open to senior backend and AI platform roles',
  regions: 'UAE, Europe, UK, New Zealand',
  email: 'zeeshanimdad1614@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/zeeshan-imdad',
    github: 'https://github.com/xeeshan16',
    leetcode: 'https://leetcode.com/u/zeeshan_16',
  },
  // Drop your CV into /public with this exact name and the "Download CV" button appears automatically.
  cvFile: 'Zeeshan-Imdad-CV.pdf',
  // GoatCounter site code (https://<code>.goatcounter.com). Analytics load only in production builds; set to '' to turn them off.
  analytics: { goatcounter: 'xeeshan16' },
};

// Headline numbers on the home page. Keep these identical to your CV.
export const highlights = [
  { value: '~60%', label: 'lower MTTR across 10 banking services with the AI Operations Copilot' },
  { value: '~40%', label: 'less incident troubleshooting time across 100K+ daily events' },
  { value: '99.95%', label: 'availability held through 4x traffic growth' },
  { value: '7+', label: 'years building backend and distributed systems' },
];

export const experience: { company: string; title: string; period: string; note?: string; summary: string; stack: string[] }[] = [
  {
    company: 'ADCB',
    title: 'Lead Backend Engineer',
    period: 'Nov 2025 – Present',
    note: 'Abu Dhabi',
    summary:
      'Lead a team of 6 engineers, owning architecture through technical specifications, estimation, and design and code reviews. Built the multi-agent AI Operations Copilot (~60% lower MTTR across 10 services), a Kafka- and SQS-driven payment architecture with idempotent consumers for 100K+ card and payment transactions, and Python telemetry analytics and Kafka automation (~40% less troubleshooting time across 100K+ daily events). Kept payments stable through downstream slowdowns with back-pressure and circuit breakers, and fixed wallet deadlocks and GC-driven latency spikes.',
    stack: ['Java 17/21', 'Kotlin', 'Spring Boot', 'Kafka', 'SQS', 'Resilience4j', 'PostgreSQL', 'Oracle', 'LangGraph', 'Azure OpenAI'],
  },
  {
    company: 'SolarWinds',
    title: 'Senior Software Engineer, Observability Platform',
    period: 'Jul 2023 – Nov 2025',
    note: 'Remote',
    summary:
      'Go stream processors and Java ETL workers ingesting Kafka events into ClickHouse with sub-second p99 query latency; Spark Structured Streaming anomaly detection alerting ServiceNow and PagerDuty on a 1-second cadence; provider failover, circuit breakers and token budgets to control LLM cost and reliability in an AI-assisted pipeline; low-latency Go services on DynamoDB with optimistic concurrency, and partner APIs secured with OAuth2, mTLS and HMAC. Mentored 4 engineers.',
    stack: ['Go', 'Java', 'Kafka', 'ClickHouse', 'Project Reactor', 'Spark', 'GCP', 'DynamoDB'],
  },
  {
    company: 'Publicis Sapient',
    title: 'Backend Engineer, Platform Integrations',
    period: 'Jul 2021 – Jul 2023',
    note: 'Fintech',
    summary:
      'Modernised business-critical legacy banking integrations by refactoring tightly coupled components into Spring Boot, Django and Go services over REST and MQ, and resolved duplicate payment processing with idempotency patterns. Improved latency and release safety with Redis caching, sliding-window rate limiting, and blue/green and canary deployments via ArgoCD.',
    stack: ['Spring Boot', 'Django', 'Go', 'REST', 'MQ', 'Redis', 'ArgoCD'],
  },
  {
    company: 'Wipro Limited',
    title: 'Software Engineer, Distributed Telemetry Pipeline',
    period: 'Aug 2019 – Jul 2021',
    summary:
      'A Go, Kafka and Redis ingestion pipeline on Kubernetes that absorbed 4x traffic growth at 99.95% availability, using idempotent checkpointed processors, dead-letter queues and consumer-lag autoscaling.',
    stack: ['Go', 'Kafka', 'Redis', 'Kubernetes'],
  },
];

export const principles = [
  {
    title: 'Design before code',
    body: 'I scope work with product, write and review the design, and explain the trade-offs to the business before the team commits.',
  },
  {
    title: 'Own it in production',
    body: 'I take on-call for what I ship and fix root causes rather than symptoms, from duplicate payments and deadlocks to GC pauses under load.',
  },
  {
    title: 'Release on evidence',
    body: 'Contract and integration tests before merge, then canary or controlled-traffic rollouts that compare latency, errors and outcomes against the existing flow.',
  },
];

export const skills = [
  { group: 'Languages', items: ['Java 17/21', 'Go', 'Python', 'Kotlin', 'TypeScript', 'SQL'] },
  { group: 'Backend & distributed systems', items: ['Spring Boot', 'FastAPI', 'Django', 'Kafka', 'RabbitMQ', 'SQS/SNS', 'gRPC', 'REST', 'Microservices', 'Idempotency', 'Back-pressure', 'Circuit breakers', 'JVM GC tuning'] },
  { group: 'Data', items: ['PostgreSQL', 'Oracle', 'MySQL', 'Redis', 'DynamoDB', 'MongoDB', 'ClickHouse', 'BigQuery', 'Spark', 'Flink'] },
  { group: 'Cloud & DevOps', items: ['Kubernetes', 'Docker', 'Terraform', 'ArgoCD', 'GitHub Actions', 'Jenkins', 'Azure', 'AWS', 'GCP', 'OpenStack', 'OpenTelemetry', 'Prometheus'] },
  { group: 'AI', items: ['LangGraph', 'LangChain', 'MCP', 'RAG', 'Pinecone', 'Azure OpenAI', 'LLM evaluation', 'Guardrails'] },
];

// `url` is optional: paste the "Show credential" link from LinkedIn to make the card clickable.
export const certifications: { name: string; issuer: string; year: string; code?: string; url?: string }[] = [
  { name: 'OCI 2025 Multicloud Architect Professional', issuer: 'Oracle', year: '2025', code: '1Z0-1151-25', url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=7DCC964BA24B6A930772747AAF065B905E71D745A33C152ED54ED184161FE08E' },
  { name: 'OCI 2025 Generative AI Professional', issuer: 'Oracle', year: '2025', code: '1Z0-1127-25', url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=8CD7BEBAEDA5F2B626A50489B6115701572F52332CFA6BBC8557C41B64864665' },
  { name: 'Oracle AI Vector Search Professional', issuer: 'Oracle', year: '2025', code: '1Z0-184-25', url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=709D1F1C658AC7FC34D628D1104AD823D72EA8BBA18F9EA292D3809C4200F99B' },
  { name: 'OCI 2025 Developer Professional', issuer: 'Oracle', year: '2025', code: '1Z0-1084-25', url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=9C056417CB8ECBD663EDC52531495931FB79641393BAA5288F32169C883B3FE9' },
  { name: 'Oracle Certified Professional, Java', issuer: 'Oracle', year: '2023' },
  { name: 'Apache Kafka Fundamentals', issuer: 'Confluent', year: '2021' },
  { name: 'Distributed Systems & Cloud Computing Specialization', issuer: 'Coursera', year: '2020' },
];

export const recognition = {
  competitive: [
    { value: '1000+', text: 'problems solved on LeetCode and GeeksforGeeks' },
    { value: '2nd', text: 'place regionally, ICPAC' },
    { value: '3rd', text: 'place, HOWATHON 2022' },
  ],
  education: { degree: 'B.Tech, Mechanical Engineering', school: 'Galgotias University', year: '2019' },
};

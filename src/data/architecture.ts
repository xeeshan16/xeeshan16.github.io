// High-level architecture diagrams, one per case study, keyed by the case study's file name.
// Coordinates are on a 960px-wide canvas. Nodes default to 56px tall.
// Edges route orthogonally between node sides; `fromAt`/`toAt` (0–1) slide the anchor along a side,
// and `via` gives explicit corner points when the automatic route would cross something.

export type Side = 'l' | 'r' | 't' | 'b';

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  title: string;
  sub?: string | string[];
  kind?: 'service' | 'accent' | 'store' | 'queue' | 'external';
  step?: number;
}

export interface DiagramZone {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  step?: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  fromSide?: Side;
  toSide?: Side;
  fromAt?: number;
  toAt?: number;
  via?: [number, number][];
  label?: string;
  async?: boolean;
  both?: boolean;
}

export interface Diagram {
  height: number;
  title: string;
  zones?: DiagramZone[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  steps: string[];
}

export const diagrams: Record<string, Diagram> = {
  'ai-operations-copilot': {
    height: 480,
    title:
      'AI Operations Copilot architecture: an engineer uses a React UI backed by a FastAPI service that runs a LangGraph graph of Planner, Retriever, Validator and Executor agents on AKS. Agents use Azure OpenAI, retrieve from Pinecone, and reach banking services only through an authorised, audited FastMCP tool server. Kafka streams operational events in.',
    zones: [{ id: 'graph', x: 40, y: 128, w: 880, h: 112, label: 'LangGraph agent graph · AKS · state in Redis' }],
    nodes: [
      { id: 'eng', x: 30, y: 30, w: 150, title: 'On-call engineer', sub: 'raises · approves', kind: 'external', step: 1 },
      { id: 'ui', x: 250, y: 30, w: 150, title: 'Copilot UI', sub: 'React · TypeScript' },
      { id: 'api', x: 470, y: 30, w: 160, title: 'Copilot API', sub: 'FastAPI', step: 2 },
      { id: 'kafka', x: 730, y: 30, w: 190, title: 'Kafka', sub: '20K+ ops events / day', kind: 'queue' },
      { id: 'planner', x: 60, y: 160, w: 180, title: 'Planner', sub: 'turns incident into steps', step: 3 },
      { id: 'retriever', x: 280, y: 160, w: 180, title: 'Retriever', sub: 'RAG with citations', step: 4 },
      { id: 'validator', x: 500, y: 160, w: 180, title: 'Validator', sub: 'evidence + permissions', kind: 'accent', step: 5 },
      { id: 'executor', x: 720, y: 160, w: 180, title: 'Executor', sub: 'prepares the action', step: 6 },
      { id: 'llm', x: 60, y: 290, w: 180, title: 'Azure OpenAI', sub: 'LLM + embeddings' },
      { id: 'pinecone', x: 280, y: 290, w: 180, title: 'Pinecone', sub: '2M+ indexed documents', kind: 'store' },
      { id: 'audit', x: 500, y: 290, w: 180, title: 'Audit trail', sub: 'every tool call', kind: 'store' },
      { id: 'mcp', x: 720, y: 290, w: 180, title: 'MCP tool server', sub: 'FastMCP · authorised', step: 7 },
      { id: 'docs', x: 60, y: 400, w: 400, title: 'Knowledge sources', sub: 'runbooks · alerts · past tickets · service docs', kind: 'external' },
      { id: 'bank', x: 500, y: 400, w: 420, title: '10 banking services', sub: 'reached only through MCP tools', kind: 'external' },
    ],
    edges: [
      { from: 'eng', to: 'ui', both: true },
      { from: 'ui', to: 'api', label: 'REST' },
      { from: 'kafka', to: 'api', label: 'events', async: true },
      { from: 'api', to: 'planner', fromSide: 'b', toSide: 'l', fromAt: 0.25, via: [[510, 108], [48, 108], [48, 188]] },
      { from: 'planner', to: 'retriever' },
      { from: 'retriever', to: 'validator' },
      { from: 'validator', to: 'executor' },
      { from: 'executor', to: 'api', fromSide: 't', toSide: 'b', toAt: 0.8, label: 'recommendation' },
      { from: 'planner', to: 'llm', label: 'LLM calls' },
      { from: 'retriever', to: 'pinecone', label: 'vector search' },
      { from: 'executor', to: 'mcp', label: 'tool calls' },
      { from: 'mcp', to: 'audit' },
      { from: 'docs', to: 'pinecone', fromSide: 't', fromAt: 0.775, toSide: 'b', label: 'chunk + embed', async: true },
      { from: 'mcp', to: 'bank', toSide: 't', toAt: 0.738, label: 'scoped calls' },
      { from: 'bank', to: 'kafka', fromSide: 'r', toSide: 'r', via: [[945, 428], [945, 58]], async: true },
    ],
    steps: [
      'An engineer raises an incident or question in the copilot UI, and later approves or rejects what comes back.',
      'The FastAPI service starts a LangGraph run, with recent operational events streamed in from Kafka.',
      'The Planner turns the request into a sequence of steps, calling Azure OpenAI.',
      'The Retriever searches Pinecone and attaches a citation to every claim.',
      'The Validator checks the draft against the evidence and the caller’s permissions. Anything that fails stops here.',
      'The Executor prepares the recommended action and returns it to the engineer for review.',
      'Any call into a banking system goes through FastMCP: authorised against the caller, scoped, and written to the audit trail.',
    ],
  },

  'payment-orchestration': {
    height: 560,
    title:
      'Payment orchestration architecture: customer channels and partner networks call secured payment APIs, which route to card, wallet and fraud services on AKS. The services exchange events over Kafka and buffered work over SQS, write to PostgreSQL and Oracle, and post to core banking. Reconciliation checks records against core banking, and fraud and risk changes are validated on a controlled slice of production traffic. Services are instrumented with OpenTelemetry and Micrometer, feeding New Relic SLO dashboards and alerts alongside AppDynamics.',
    zones: [
      { id: 'svc', x: 450, y: 20, w: 230, h: 280, label: 'Payment services · AKS', step: 3 },
      { id: 'rollout', x: 20, y: 230, w: 380, h: 310, label: 'Controlled rollout · fraud & risk' },
    ],
    nodes: [
      { id: 'cust', x: 20, y: 40, w: 170, title: 'Customer channels', sub: 'cards · wallets', kind: 'external', step: 1 },
      { id: 'partner', x: 20, y: 150, w: 170, title: 'Partner networks', sub: 'OAuth2 · mTLS', kind: 'external' },
      {
        id: 'api', x: 230, y: 40, w: 170, h: 166, title: 'Payment APIs',
        sub: ['Spring Security', 'OAuth2 · mTLS', 'Snowflake txn IDs'], step: 2,
      },
      { id: 'card', x: 485, y: 60, w: 160, title: 'Card payments', sub: 'lifecycle + settlement' },
      { id: 'wallet', x: 485, y: 140, w: 160, title: 'Wallet payments', sub: 'balance updates' },
      { id: 'fraud', x: 485, y: 220, w: 160, title: 'Fraud & risk', sub: 'transaction-risk checks' },
      { id: 'kafka', x: 740, y: 60, w: 200, title: 'Kafka', sub: 'payment events', kind: 'queue' },
      { id: 'rabbit', x: 740, y: 140, w: 200, title: 'SQS', sub: 'buffered work queues', kind: 'queue' },
      { id: 'core', x: 740, y: 220, w: 200, title: 'Core banking', sub: "bank's systems of record", kind: 'external' },
      { id: 'pg', x: 450, y: 350, w: 110, title: 'PostgreSQL', kind: 'store' },
      { id: 'ora', x: 570, y: 350, w: 110, title: 'Oracle', kind: 'store' },
      { id: 'recon', x: 740, y: 350, w: 200, h: 64, title: 'Reconciliation', sub: ['settlement files · wallets', 'partner vs core'], step: 5 },
      { id: 'split', x: 40, y: 280, w: 150, title: 'Traffic split', sub: 'controlled subset', step: 4 },
      { id: 'current', x: 230, y: 280, w: 150, title: 'Current flow', sub: 'existing rules' },
      { id: 'candidate', x: 230, y: 370, w: 150, title: 'Candidate', sub: 'Resilience4j-hardened', kind: 'accent' },
      { id: 'compare', x: 40, y: 470, w: 340, h: 50, title: 'Compare before full rollout', sub: 'latency · errors · false +/− rates' },
      { id: 'otel', x: 450, y: 460, w: 230, h: 64, title: 'OpenTelemetry', sub: ['Java agent · SDK spans', 'Micrometer metrics'], step: 6 },
      { id: 'apm', x: 740, y: 460, w: 200, h: 64, title: 'New Relic · AppDynamics', sub: ['NRQL dashboards', 'SLO alerts'], kind: 'external' },
    ],
    edges: [
      { from: 'cust', to: 'api', toAt: 0.169 },
      { from: 'partner', to: 'api', toAt: 0.831 },
      { from: 'api', to: 'svc', toSide: 'l', toAt: 0.368 },
      { from: 'svc', to: 'kafka', fromSide: 'r', fromAt: 0.243, label: 'events', both: true, async: true },
      { from: 'svc', to: 'rabbit', fromSide: 'r', fromAt: 0.529, label: 'jobs', both: true, async: true },
      { from: 'svc', to: 'core', fromSide: 'r', fromAt: 0.814, label: 'post' },
      { from: 'svc', to: 'pg', fromSide: 'b', fromAt: 0.239, toSide: 't', label: 'txns' },
      { from: 'svc', to: 'ora', fromSide: 'b', fromAt: 0.761, toSide: 't' },
      { from: 'core', to: 'recon', label: 'ledger' },
      { from: 'fraud', to: 'rollout', fromSide: 'l', toSide: 'r', toAt: 0.062 },
      { from: 'split', to: 'current' },
      { from: 'split', to: 'candidate' },
      { from: 'current', to: 'compare', fromSide: 'r', toSide: 'r', via: [[392, 308], [392, 495]] },
      { from: 'candidate', to: 'compare', fromSide: 'b', toSide: 't', toAt: 0.779 },
      { from: 'svc', to: 'otel', fromSide: 'r', fromAt: 0.96, toSide: 't', toAt: 0.5, via: [[710, 289], [710, 440], [565, 440]], async: true },
      { from: 'otel', to: 'apm', label: 'OTLP' },
    ],
    steps: [
      'Customer channels and partner networks call the payment APIs over OAuth2 and mutual TLS.',
      'Spring Security enforces OAuth2, and every transaction gets a time-ordered Snowflake ID without asking a central sequence.',
      'Card, wallet and fraud services exchange events over Kafka and buffered work over SQS. Consumers are idempotent on the transaction ID, back-pressure and circuit breakers isolate slow dependencies, and writes use explicit transaction boundaries on PostgreSQL and Oracle.',
      'A change to fraud or risk logic first takes a controlled slice of production traffic, and its latency, errors and false-positive and false-negative rates are compared with the existing flow.',
      'Reconciliation checks settlement files, wallet balances and partner records against core banking, so mismatches are caught by the system.',
      'Every service runs the OpenTelemetry Java agent, with SDK spans around payment state transitions and core-banking calls and Micrometer metrics. Trace context crosses service calls and Kafka hops, and SLOs on payment success rate and latency drive NRQL dashboards and alerts in New Relic, alongside AppDynamics.',
    ],
  },

  'observability-pipeline': {
    height: 610,
    title:
      'Observability platform architecture: telemetry lands on Kafka and splits into two paths. On AWS EKS, Go stream processors and Java ETL workers buffer with Project Reactor and write to ClickHouse, PostgreSQL and MongoDB, and a query API serves engineers in under a second. On GCP, Spark Structured Streaming detects anomalies, stores aggregates in BigQuery and alerts ServiceNow and PagerDuty every second. The platform\'s own Go and Java services are instrumented with OpenTelemetry and send OTLP to Collector pipelines that export to New Relic and Datadog.',
    zones: [
      { id: 'eks', x: 320, y: 20, w: 490, h: 220, label: 'Query path · AWS EKS · Terraform' },
      { id: 'gcp', x: 320, y: 270, w: 490, h: 180, label: 'Alerting path · GCP' },
      { id: 'otel', x: 20, y: 470, w: 920, h: 125, label: "Instrumentation · OpenTelemetry · the platform's own services" },
    ],
    nodes: [
      { id: 'src', x: 20, y: 207, w: 130, title: 'Telemetry', sub: 'high-throughput', kind: 'external', step: 1 },
      { id: 'kafka', x: 180, y: 207, w: 110, title: 'Kafka', sub: 'ingest topics', kind: 'queue' },
      { id: 'ingest', x: 340, y: 100, w: 140, h: 60, title: 'Ingest', sub: ['Go processors', 'Java ETL · Reactor'], step: 2 },
      { id: 'ch', x: 530, y: 45, w: 120, h: 46, title: 'ClickHouse', kind: 'store' },
      { id: 'pg', x: 530, y: 107, w: 120, h: 46, title: 'PostgreSQL', kind: 'store' },
      { id: 'mongo', x: 530, y: 169, w: 120, h: 46, title: 'MongoDB', kind: 'store' },
      { id: 'q', x: 690, y: 100, w: 105, h: 60, title: 'Query API', sub: ['Spring Boot', 'p99 < 1s'], kind: 'accent', step: 3 },
      { id: 'eng', x: 840, y: 102, w: 100, title: 'Engineers', sub: 'dashboards', kind: 'external' },
      { id: 'spark', x: 340, y: 320, w: 160, h: 60, title: 'Spark Streaming', sub: ['Structured Streaming', 'on GKE'], step: 4 },
      { id: 'anomaly', x: 530, y: 320, w: 140, h: 60, title: 'Anomaly detection', sub: 'windowed', kind: 'accent' },
      { id: 'bq', x: 530, y: 398, w: 140, h: 44, title: 'BigQuery', kind: 'store' },
      { id: 'alert', x: 700, y: 320, w: 95, h: 60, title: 'Alerter', sub: 'every 1s', step: 5 },
      { id: 'llm', x: 700, y: 398, w: 95, h: 44, title: 'LLM summary', sub: 'best effort', kind: 'external', step: 6 },
      { id: 'snow', x: 840, y: 290, w: 100, title: 'ServiceNow', kind: 'external' },
      { id: 'pd', x: 840, y: 370, w: 100, title: 'PagerDuty', kind: 'external' },
      { id: 'osvc', x: 50, y: 515, w: 210, h: 60, title: 'Go & Java services', sub: ['OTel Go SDK', 'Java agent auto-instrumentation'] },
      { id: 'otelcol', x: 340, y: 515, w: 240, h: 60, title: 'OTel Collector', sub: ['batch · attributes · sampling', 'cardinality · retention'], kind: 'accent', step: 7 },
      { id: 'nr', x: 680, y: 500, w: 220, h: 40, title: 'New Relic', kind: 'external' },
      { id: 'dd', x: 680, y: 550, w: 220, h: 40, title: 'Datadog', kind: 'external' },
    ],
    edges: [
      { from: 'src', to: 'kafka' },
      { from: 'kafka', to: 'ingest', via: [[304, 235], [304, 130]], async: true },
      { from: 'kafka', to: 'spark', via: [[304, 235], [304, 350]], async: true },
      { from: 'ingest', to: 'ch' },
      { from: 'ingest', to: 'pg' },
      { from: 'ingest', to: 'mongo' },
      { from: 'ch', to: 'q' },
      { from: 'pg', to: 'q' },
      { from: 'mongo', to: 'q' },
      { from: 'q', to: 'eng', both: true },
      { from: 'spark', to: 'anomaly' },
      { from: 'spark', to: 'bq', fromSide: 'b', toSide: 'l', label: 'aggregates' },
      { from: 'anomaly', to: 'alert' },
      { from: 'alert', to: 'snow' },
      { from: 'alert', to: 'pd' },
      { from: 'alert', to: 'llm', async: true },
      { from: 'osvc', to: 'otelcol', label: 'OTLP' },
      { from: 'otelcol', to: 'nr', fromAt: 0.25, label: 'OTLP' },
      { from: 'otelcol', to: 'dd', fromAt: 0.75 },
    ],
    steps: [
      'Telemetry lands on Kafka and feeds two independent paths, so a slow query path can never delay an alert.',
      'Go stream processors and Java ETL workers absorb bursts with Project Reactor buffering and write to ClickHouse (alongside PostgreSQL and MongoDB), indexed and tuned on the way in.',
      'The query API serves engineers and dashboards with p99 latency under a second.',
      'Spark Structured Streaming on GKE aggregates the stream, flags anomalies and lands aggregates in BigQuery for analysis.',
      'Alerts reach ServiceNow and PagerDuty on a one-second cadence.',
      'LLM-written summaries are best-effort, behind provider failover, circuit breakers and token budgets, so an LLM outage or cost spike never delays an alert.',
      'The platform\'s own Go and Java services are instrumented with OpenTelemetry (Go SDK, Java agent) and send traces, metrics and logs over OTLP to Collector pipelines that batch, enrich, sample and control cardinality before exporting to New Relic and Datadog, so no service is tied to one vendor.',
    ],
  },

  'banking-integration-platform': {
    height: 500,
    title:
      'Legacy banking integration architecture: digital channels reach modern middleware over REST and MQ, integration microservices translate to legacy banking systems behind a sliding-window rate limiter and Redis cache, with MySQL and MongoDB for service data. A release pipeline runs CI/CD, ArgoCD, canary and blue/green deployments.',
    zones: [
      { id: 'svc', x: 400, y: 40, w: 360, h: 280, label: 'Integration microservices' },
      { id: 'rel', x: 20, y: 360, w: 920, h: 120, label: 'Release pipeline' },
    ],
    nodes: [
      { id: 'ch', x: 20, y: 110, w: 140, title: 'Digital channels', sub: 'new services', kind: 'external', step: 1 },
      { id: 'mw', x: 210, y: 110, w: 150, title: 'Modern middleware', sub: 'REST · MQ' },
      { id: 'adapters', x: 415, y: 110, w: 165, h: 64, title: 'Integration services', sub: ['Spring Boot · Go · Django', 'idempotent · SOLID/DDD'], step: 2 },
      { id: 'limiter', x: 620, y: 110, w: 125, h: 64, title: 'Rate limiter', sub: 'sliding window', kind: 'accent', step: 3 },
      { id: 'redis', x: 620, y: 230, w: 125, title: 'Redis', sub: 'response cache', kind: 'store' },
      { id: 'db', x: 415, y: 230, w: 165, title: 'MySQL · MongoDB', sub: 'service data', kind: 'store' },
      { id: 'legacy', x: 800, y: 110, w: 140, h: 64, title: 'Legacy banking', sub: 'core systems', kind: 'external' },
      { id: 'ci', x: 50, y: 400, w: 180, title: 'CI/CD', sub: 'build · test', step: 4 },
      { id: 'argo', x: 290, y: 400, w: 180, title: 'ArgoCD', sub: 'deploys new version' },
      { id: 'canary', x: 530, y: 400, w: 180, title: 'Canary', sub: 'slice of real traffic', kind: 'accent', step: 5 },
      { id: 'bg', x: 770, y: 400, w: 150, title: 'Blue/green switch', sub: 'instant rollback' },
    ],
    edges: [
      { from: 'ch', to: 'mw' },
      { from: 'mw', to: 'adapters', toAt: 0.4375, fromAt: 0.5, both: true },
      { from: 'adapters', to: 'limiter' },
      { from: 'limiter', to: 'legacy' },
      { from: 'adapters', to: 'db', label: 'data' },
      { from: 'limiter', to: 'redis', label: 'cache' },
      { from: 'ci', to: 'argo' },
      { from: 'argo', to: 'canary' },
      { from: 'canary', to: 'bg' },
    ],
    steps: [
      'New channels and services reach the bank through modern middleware over REST and message queues.',
      'Integration services translate between the middleware and legacy cores. Calls are idempotent, so retries against a slow legacy system can’t duplicate effects.',
      'Redis caching and a sliding-window rate limiter keep bursts from new channels from overwhelming legacy systems with fixed capacity.',
      'CI/CD builds and tests every change, and ArgoCD rolls it out.',
      'A canary takes a slice of real traffic first, and blue/green keeps an instant way back.',
    ],
  },

  'telemetry-ingestion-pipeline': {
    height: 350,
    title:
      'Telemetry ingestion architecture: producers publish to partitioned Kafka topics, idempotent checkpointed Go processors on Kubernetes consume them with shared state in Redis, send processed data downstream and failures to a dead-letter queue, and an autoscaler sizes the processors on consumer lag.',
    zones: [{ id: 'k8s', x: 390, y: 30, w: 370, h: 300, label: 'Kubernetes' }],
    nodes: [
      { id: 'src', x: 20, y: 100, w: 140, title: 'Telemetry sources', sub: 'distributed producers', kind: 'external', step: 1 },
      { id: 'kafka', x: 200, y: 60, w: 150, h: 136, title: 'Kafka', sub: ['partitioned topics', 'consumer groups'], kind: 'queue' },
      { id: 'proc', x: 410, y: 100, w: 160, h: 60, title: 'Go processors × N', sub: ['idempotent', 'checkpointed'], kind: 'accent', step: 2 },
      { id: 'redis', x: 410, y: 230, w: 100, title: 'Redis', sub: 'shared state', kind: 'store' },
      { id: 'scaler', x: 600, y: 230, w: 140, title: 'Autoscaler', sub: 'on consumer lag', step: 4 },
      { id: 'down', x: 800, y: 60, w: 140, title: 'Downstream', sub: 'processing', kind: 'external' },
      { id: 'dlq', x: 800, y: 170, w: 140, title: 'Dead-letter queue', sub: 'inspect · replay', kind: 'queue', step: 3 },
    ],
    edges: [
      { from: 'src', to: 'kafka', toAt: 0.5 },
      { from: 'kafka', to: 'proc', fromAt: 0.515, label: 'consume', async: true },
      { from: 'proc', to: 'down', fromAt: 0.25, label: 'processed' },
      { from: 'proc', to: 'dlq', fromAt: 0.75, label: 'failed', async: true },
      { from: 'proc', to: 'redis', fromSide: 'b', fromAt: 0.3125, toSide: 't', label: 'state' },
      { from: 'scaler', to: 'proc', fromSide: 't', toSide: 'b', toAt: 0.85, label: 'replicas' },
      { from: 'kafka', to: 'scaler', fromSide: 'b', toSide: 'b', via: [[275, 310], [670, 310]], label: 'consumer lag', async: true },
    ],
    steps: [
      'Producers publish telemetry to partitioned Kafka topics.',
      'Go processors consume in consumer groups. Each is idempotent and checkpoints its progress, so a redelivered message or a restart is safe; fast shared state lives in Redis.',
      'Records that can’t be processed go to a dead-letter queue to be inspected and replayed, so they never block a partition.',
      'An autoscaler adds or removes processors based on consumer lag rather than CPU.',
    ],
  },

  'telemetry-automation': {
    height: 510,
    title:
      'Telemetry analytics and automation architecture: banking services emit operational events to Kafka; FastAPI services analyse them for on-call engineers, and Kafka consumers match known event patterns and trigger automated steps back on the services. OpenTelemetry Collectors on AKS and in on-premises bare-metal and air-gapped environments export through a gateway Collector to the internal observability backend.',
    zones: [
      { id: 'py', x: 400, y: 20, w: 370, h: 280, label: 'Python services' },
      { id: 'otel', x: 20, y: 360, w: 920, h: 135, label: 'OpenTelemetry Collector pipelines · cloud and on-premises' },
    ],
    nodes: [
      { id: 'sys', x: 20, y: 100, w: 150, title: 'Banking services', sub: 'operational signals', kind: 'external', step: 1 },
      { id: 'colaks', x: 50, y: 395, w: 250, h: 44, title: 'Collector · Azure AKS', sub: 'cloud services' },
      { id: 'colprem', x: 50, y: 445, w: 250, h: 44, title: 'Collector · on-premises', sub: 'bare-metal · air-gapped' },
      { id: 'gw', x: 380, y: 415, w: 200, h: 60, title: 'Gateway Collector', sub: 'internal export', kind: 'accent', step: 4 },
      { id: 'backend', x: 660, y: 415, w: 260, h: 60, title: 'Observability backend', sub: ['metrics · logs · traces', 'shared trace IDs'], kind: 'store' },
      { id: 'kafka', x: 210, y: 100, w: 150, title: 'Kafka', sub: '100K+ events / day', kind: 'queue' },
      { id: 'analytics', x: 420, y: 60, w: 170, title: 'Telemetry analytics', sub: ['FastAPI', 'ingest · analyse'], step: 2 },
      { id: 'consumers', x: 420, y: 180, w: 170, title: 'Pattern consumers', sub: ['Kafka consumers', 'known event patterns'], kind: 'accent', step: 3 },
      { id: 'auto', x: 640, y: 180, w: 115, title: 'Automation', sub: 'routine steps' },
      { id: 'eng', x: 810, y: 60, w: 130, title: 'Engineers', sub: 'on call', kind: 'external' },
    ],
    edges: [
      { from: 'sys', to: 'kafka' },
      { from: 'kafka', to: 'analytics', via: [[380, 128], [380, 88]], async: true },
      { from: 'kafka', to: 'consumers', via: [[380, 128], [380, 208]], async: true },
      { from: 'analytics', to: 'eng', label: 'analysed picture' },
      { from: 'consumers', to: 'auto' },
      { from: 'auto', to: 'sys', fromSide: 'b', toSide: 'b', via: [[697.5, 320], [95, 320]], label: 'automated action' },
      { from: 'colaks', to: 'gw', toAt: 0.3 },
      { from: 'colprem', to: 'gw', toAt: 0.7 },
      { from: 'gw', to: 'backend', label: 'OTLP' },
    ],
    steps: [
      'Banking services emit operational signals onto Kafka, more than 100,000 events a day.',
      'FastAPI services ingest and analyse the telemetry, so on-call engineers start from an assembled picture instead of building it by hand.',
      'Kafka consumers watch for known event patterns and trigger automated steps, so routine work doesn’t wait for a person.',
      'OpenTelemetry Collectors run on AKS and in on-premises bare-metal and air-gapped environments; air-gapped zones export through a gateway Collector to the internal backend. Metrics, logs and traces share trace IDs and service and environment attributes, so an alert links straight to the traces and logs behind it.',
    ],
  },
};

// Inline diagrams used inside case-study write-ups (rendered in compact mode).
export const paymentStateModel: Diagram = {
  height: 400,
  title:
    'Payment state model: a payment is RECEIVED under a stable payment key, then atomically claimed into PROCESSING, with bounded retries for transient failures. It ends SUCCEEDED or FAILED. If the outcome cannot be established it becomes PENDING or UNKNOWN, and the consumer verifies the outcome with the authoritative payment system instead of resubmitting. Verified outcomes become SUCCEEDED or FAILED; unresolved or stale ones go to reconciliation with monitoring and alerting.',
  nodes: [
    { id: 'received', x: 20, y: 124, w: 150, title: 'RECEIVED', sub: 'stable payment key' },
    { id: 'processing', x: 230, y: 120, w: 180, h: 64, title: 'PROCESSING', sub: ['atomic claim', 'bounded retries'], kind: 'accent' },
    { id: 'succeeded', x: 480, y: 30, w: 150, h: 48, title: 'SUCCEEDED' },
    { id: 'failed', x: 480, y: 128, w: 150, h: 48, title: 'FAILED' },
    { id: 'pending', x: 480, y: 228, w: 180, title: 'PENDING / UNKNOWN', sub: 'outcome not established' },
    { id: 'verify', x: 730, y: 228, w: 200, title: 'Verify outcome', sub: 'authoritative payment system', kind: 'external' },
    { id: 'recon', x: 730, y: 330, w: 200, title: 'Reconciliation', sub: 'monitoring · alerting', kind: 'store' },
  ],
  edges: [
    { from: 'received', to: 'processing', toAt: 0.5 },
    { from: 'processing', to: 'succeeded', fromAt: 0.25 },
    { from: 'processing', to: 'failed' },
    { from: 'processing', to: 'pending', fromAt: 0.75 },
    { from: 'pending', to: 'verify' },
    { from: 'verify', to: 'succeeded', fromSide: 't', fromAt: 0.75, toSide: 'r' },
    { from: 'verify', to: 'failed', fromSide: 't', fromAt: 0.35, toSide: 'r' },
    { from: 'verify', to: 'recon', label: 'unresolved or stale', async: true },
  ],
  steps: [],
};

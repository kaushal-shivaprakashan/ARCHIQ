import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════
   DESIGN SYSTEM — "Terminal Noir"
   Aesthetic: Bloomberg terminal meets Vercel dashboard
   Dark obsidian, electric teal accents, mono type
════════════════════════════════════════════════ */
const C = {
  bg:        "#060911",
  bgDeep:    "#030508",
  surface:   "#0C1322",
  surfaceHi: "#111D30",
  border:    "#1A2D47",
  borderHi:  "#254060",
  cyan:      "#00D4FF",
  cyanDim:   "#0099BB",
  cyanGlow:  "rgba(0,212,255,0.10)",
  green:     "#00E5A0",
  amber:     "#FFBB00",
  rose:      "#FF4D6A",
  violet:    "#9B72F8",
  orange:    "#FF7040",
  sky:       "#38C8F8",
  slate:     "#526070",
  text:      "#C8D8E8",
  textHi:    "#EEF4FA",
  textLo:    "#445566",
  textDim:   "#8899AA",
};

/* ── Tool logo URLs (official/SVG from CDN or simple SVG data) ── */
const LOGOS = {
  snowflake:   "https://cdn.brandfetch.io/idJz-fGD_q/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  bigquery:    "https://www.gstatic.com/devrel-devsite/prod/v4f0b9e43e5ed71af6c2b47c3e8e68e7e9d8a5e7a8e8b9b8b8e8e8e8e8e8e8/cloud/images/cloud-logo.svg",
  redshift:    "https://cdn.brandfetch.io/idN0BpjUFs/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  databricks:  "https://cdn.brandfetch.io/idSUrLOWuG/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  dbt:         "https://seeklogo.com/images/D/dbt-logo-500AB0BAA7-seeklogo.com.png",
  airflow:     "https://upload.wikimedia.org/wikipedia/commons/d/de/AirflowLogo.png",
  kafka:       "https://upload.wikimedia.org/wikipedia/commons/0/05/Apache_kafka.svg",
  spark:       "https://upload.wikimedia.org/wikipedia/commons/f/f3/Apache_Spark_logo.svg",
  flink:       "https://flink.apache.org/img/logo/png/200/flink_squirrel_200_color.png",
  fivetran:    "https://cdn.brandfetch.io/idFRNKjPNz/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  airbyte:     "https://cdn.brandfetch.io/idexlGPa_s/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  s3:          "https://upload.wikimedia.org/wikipedia/commons/b/bc/Amazon-S3-Logo.svg",
  prefect:     "https://cdn.brandfetch.io/idFk6XT-Es/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  dagster:     "https://dagster.io/images/brand/logos/dagster-primary-mark.svg",
  tableau:     "https://cdn.brandfetch.io/idnfBRMekl/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  powerbi:     "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg",
  looker:      "https://cdn.brandfetch.io/id_XKcnHP0/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  metabase:    "https://cdn.brandfetch.io/idSizudz81/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  debezium:    "https://debezium.io/images/color-stacked-debezium_logo_600px.jpg",
  feast:       "https://feast.dev/img/mark.png",
  monte_carlo: "https://cdn.brandfetch.io/id3sk5rb4l/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  synapse:     "https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg",
  clickhouse:  "https://cdn.brandfetch.io/idneYBHuBU/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
  census:      "https://cdn.brandfetch.io/idjUXB1l0E/theme/dark/symbol.svg?c=1dxbfHSJFAPEwi1wPP",
};

const TOOL_LOGO_MAP = {
  "Snowflake": LOGOS.snowflake,
  "BigQuery": LOGOS.bigquery,
  "Amazon Redshift": LOGOS.redshift,
  "Azure Synapse": LOGOS.synapse,
  "Databricks": LOGOS.databricks,
  "ClickHouse": LOGOS.clickhouse,
  "dbt Core": LOGOS.dbt,
  "dbt Core / Cloud": LOGOS.dbt,
  "Apache Airflow": LOGOS.airflow,
  "AWS MWAA": LOGOS.airflow,
  "Apache Kafka": LOGOS.kafka,
  "Amazon MSK": LOGOS.kafka,
  "Azure Event Hubs": LOGOS.kafka,
  "Google Pub/Sub": LOGOS.kafka,
  "Apache Spark": LOGOS.spark,
  "AWS EMR": LOGOS.spark,
  "Dataproc": LOGOS.spark,
  "Apache Flink": LOGOS.flink,
  "Fivetran": LOGOS.fivetran,
  "Airbyte": LOGOS.airbyte,
  "Amazon S3": LOGOS.s3,
  "Prefect": LOGOS.prefect,
  "Dagster": LOGOS.dagster,
  "Tableau": LOGOS.tableau,
  "Power BI": LOGOS.powerbi,
  "Looker": LOGOS.looker,
  "Metabase": LOGOS.metabase,
  "Debezium": LOGOS.debezium,
  "Feast": LOGOS.feast,
  "Census": LOGOS.census,
};

const CAT = {
  source:        { color: C.sky,    glyph: "◈", label: "Source" },
  ingestion:     { color: C.cyan,   glyph: "↓", label: "Ingestion" },
  streaming:     { color: C.violet, glyph: "≋", label: "Streaming" },
  storage:       { color: C.amber,  glyph: "⬡", label: "Storage" },
  processing:    { color: C.orange, glyph: "⚙", label: "Processing" },
  transformation:{ color: "#F472B6",glyph: "⇄", label: "Transform" },
  warehouse:     { color: C.green,  glyph: "▦", label: "Warehouse" },
  orchestration: { color: "#A78BFA",glyph: "◎", label: "Orchestrate" },
  serving:       { color: "#34D399",glyph: "→", label: "Serving" },
  visualization: { color: "#FB923C",glyph: "◻", label: "Visualize" },
  governance:    { color: "#E2E8F0",glyph: "⚑", label: "Governance" },
};

/* ════════════════════════════════════════════════
   WIZARD STEPS — 15 comprehensive parameters
════════════════════════════════════════════════ */
const STEPS = [
  { id:"industry", icon:"🏭", title:"Industry Vertical", subtitle:"Your domain shapes compliance, data types, and regulatory tooling", field:"industry", type:"grid",
    options:[
      {v:"fintech",label:"FinTech / Banking",icon:"🏦",desc:"Transactions, fraud, risk"},
      {v:"ecommerce",label:"E-Commerce / Retail",icon:"🛍",desc:"Orders, clickstream, inventory"},
      {v:"healthcare",label:"Healthcare / Life Sci",icon:"🏥",desc:"EHR, claims, genomics"},
      {v:"saas",label:"SaaS / Tech",icon:"💻",desc:"Events, metrics, product analytics"},
      {v:"media",label:"Media / Streaming",icon:"🎬",desc:"Content, recommendations, ads"},
      {v:"logistics",label:"Logistics / Supply Chain",icon:"🚚",desc:"GPS, inventory, ERP, WMS"},
      {v:"energy",label:"Energy / IoT",icon:"⚡",desc:"Sensors, SCADA, telemetry"},
      {v:"other",label:"Other / General",icon:"🔷",desc:"General purpose pipeline"},
    ]},
  { id:"usecase", icon:"🎯", title:"Primary Use Case", subtitle:"The core problem this pipeline solves", field:"usecase", type:"grid",
    options:[
      {v:"analytics",label:"Business Analytics",icon:"📊",desc:"BI dashboards & reporting"},
      {v:"ml_platform",label:"ML / AI Platform",icon:"🤖",desc:"Feature store, model training"},
      {v:"realtime",label:"Real-time Streaming",icon:"⚡",desc:"Event-driven, sub-second"},
      {v:"lakehouse",label:"Data Lakehouse",icon:"🏞",desc:"Unified storage & compute"},
      {v:"cdc",label:"CDC / Replication",icon:"🔄",desc:"DB sync, change capture"},
      {v:"data_science",label:"Data Science Platform",icon:"🔬",desc:"Notebooks, experiments"},
      {v:"customer360",label:"Customer 360",icon:"👤",desc:"Identity resolution, CRM"},
      {v:"compliance_rpt",label:"Compliance Reporting",icon:"📋",desc:"Audit trails, regulatory"},
    ]},
  { id:"sources", icon:"🔌", title:"Data Sources", subtitle:"What systems produce your data? Select all that apply", field:"sources", type:"multi",
    options:[
      {v:"rdbms",label:"Relational DBs",icon:"🗄",desc:"PostgreSQL, MySQL, Oracle"},
      {v:"nosql",label:"NoSQL / Document",icon:"📦",desc:"MongoDB, Cassandra, DynamoDB"},
      {v:"rest_api",label:"REST APIs",icon:"🌐",desc:"Third-party & internal APIs"},
      {v:"events",label:"Event Streams",icon:"⚡",desc:"Kafka, Kinesis, Pub/Sub"},
      {v:"files",label:"Flat Files",icon:"📄",desc:"CSV, JSON, Parquet, XML"},
      {v:"saas_tools",label:"SaaS Tools",icon:"☁",desc:"Salesforce, HubSpot, Stripe"},
      {v:"iot",label:"IoT / Sensors",icon:"📡",desc:"MQTT, SCADA, time-series"},
      {v:"logs",label:"App / Server Logs",icon:"📝",desc:"CloudWatch, Datadog, ELK"},
      {v:"erp",label:"ERP Systems",icon:"🏢",desc:"SAP, Oracle EBS, NetSuite"},
      {v:"data_lake",label:"Existing Data Lake",icon:"🏞",desc:"S3, ADLS, GCS buckets"},
      {v:"mainframe",label:"Mainframe / Legacy",icon:"🖥",desc:"COBOL, DB2, VSAM"},
      {v:"web_scraping",label:"Web Scraping",icon:"🕷",desc:"Scrapy, Playwright, APIs"},
    ]},
  { id:"cloud", icon:"☁️", title:"Cloud Platform", subtitle:"Infrastructure target for your architecture", field:"cloud", type:"grid",
    options:[
      {v:"aws",label:"Amazon AWS",icon:"🟠",desc:"S3, Redshift, Glue, MSK, EMR"},
      {v:"azure",label:"Microsoft Azure",icon:"🔵",desc:"ADLS, Synapse, ADF, HDInsight"},
      {v:"gcp",label:"Google Cloud",icon:"🟢",desc:"BigQuery, Dataflow, Pub/Sub"},
      {v:"onprem",label:"On-Premises",icon:"🖥",desc:"Hadoop, bare metal, VMware"},
      {v:"hybrid",label:"Hybrid Cloud",icon:"🔀",desc:"Mix of cloud + on-prem"},
      {v:"multicloud",label:"Multi-Cloud",icon:"🌐",desc:"AWS + Azure or GCP"},
    ]},
  { id:"volume", icon:"📦", title:"Data Volume & Velocity", subtitle:"Scale determines storage, compute, and tool choices", field:"volume", type:"grid",
    options:[
      {v:"tiny",label:"< 1 GB/day",icon:"🔹",desc:"MVP / POC / Startup"},
      {v:"small",label:"1 – 100 GB/day",icon:"🔷",desc:"Early-growth scale"},
      {v:"medium",label:"100 GB – 10 TB/day",icon:"💠",desc:"Mid-market scale"},
      {v:"large",label:"10 – 100 TB/day",icon:"🌀",desc:"Enterprise scale"},
      {v:"xlarge",label:"> 100 TB/day",icon:"🌐",desc:"Hyperscale / Big Tech"},
    ]},
  { id:"latency", icon:"⏱", title:"Latency Requirements", subtitle:"Freshness SLA for your data consumers", field:"latency", type:"grid",
    options:[
      {v:"batch_daily",label:"Daily Batch (T+1)",icon:"🌙",desc:"Nightly or once-a-day"},
      {v:"batch_hourly",label:"Hourly Batch",icon:"🕐",desc:"Every 1–4 hours"},
      {v:"nearreal",label:"Near Real-time (~15 min)",icon:"⏩",desc:"Micro-batch / mini-batch"},
      {v:"streaming",label:"Streaming (< 60s)",icon:"⚡",desc:"Continuous pipelines"},
      {v:"cep",label:"Complex Event (< 1s)",icon:"🚀",desc:"Stateful CEP, sub-second"},
    ]},
  { id:"team", icon:"👥", title:"Team Size & Maturity", subtitle:"Engineering capacity shapes operational complexity choices", field:"team", type:"grid",
    options:[
      {v:"solo",label:"Solo / 1–2 Eng",icon:"👤",desc:"Zero ops overhead needed"},
      {v:"small",label:"Small Team 3–8",icon:"👥",desc:"Managed services preferred"},
      {v:"medium",label:"Mid Team 9–20",icon:"🏘",desc:"Balance control & ease"},
      {v:"large",label:"Large Team 20+",icon:"🏢",desc:"Custom infra is acceptable"},
      {v:"platform",label:"Platform / DataOps Team",icon:"⚙",desc:"Building for internal consumers"},
    ]},
  { id:"lang_pref", icon:"💻", title:"Team's Primary Language", subtitle:"Language preference influences framework and SDK choices", field:"lang_pref", type:"grid",
    options:[
      {v:"python",label:"Python",icon:"🐍",desc:"PySpark, dbt Python, Pandas"},
      {v:"sql",label:"SQL-first",icon:"📋",desc:"dbt SQL, stored procs"},
      {v:"scala",label:"Scala / Java",icon:"☕",desc:"Native Spark, Flink, Akka"},
      {v:"mixed",label:"Mixed / Polyglot",icon:"🔀",desc:"No strong preference"},
    ]},
  { id:"budget", icon:"💰", title:"Monthly Infrastructure Budget", subtitle:"Budget drives managed vs self-hosted tradeoffs", field:"budget", type:"grid",
    options:[
      {v:"bootstrap",label:"< $500/mo",icon:"🌱",desc:"Open-source stack only"},
      {v:"startup",label:"$500 – $5K/mo",icon:"🚀",desc:"Selective managed services"},
      {v:"growth",label:"$5K – $50K/mo",icon:"📈",desc:"Managed + some custom"},
      {v:"enterprise",label:"$50K+/mo",icon:"🏛",desc:"Full managed / enterprise SLAs"},
    ]},
  { id:"migration", icon:"🔄", title:"Greenfield or Migration?", subtitle:"Existing investments heavily influence tool selection", field:"migration", type:"grid",
    options:[
      {v:"greenfield",label:"Greenfield",icon:"🌿",desc:"Starting from scratch"},
      {v:"migrate_hadoop",label:"Migrating from Hadoop",icon:"🐘",desc:"HDFS, Hive, MapReduce legacy"},
      {v:"migrate_legacy",label:"Migrating Legacy ETL",icon:"🔧",desc:"SSIS, Informatica, DataStage"},
      {v:"extend",label:"Extending Existing",icon:"🧩",desc:"Adding to working pipelines"},
    ]},
  { id:"compliance", icon:"🔒", title:"Compliance & Regulations", subtitle:"Regulatory requirements drive encryption, audit, and access controls", field:"compliance", type:"multi",
    options:[
      {v:"none",label:"None",icon:"✅",desc:"No special requirements"},
      {v:"gdpr",label:"GDPR",icon:"🇪🇺",desc:"EU personal data"},
      {v:"hipaa",label:"HIPAA",icon:"🏥",desc:"Healthcare / PHI"},
      {v:"pci",label:"PCI-DSS",icon:"💳",desc:"Payment card data"},
      {v:"soc2",label:"SOC 2 Type II",icon:"🔐",desc:"SaaS security audit"},
      {v:"ccpa",label:"CCPA",icon:"🇺🇸",desc:"California consumer data"},
      {v:"iso27001",label:"ISO 27001",icon:"📜",desc:"InfoSec management"},
      {v:"fedramp",label:"FedRAMP",icon:"🦅",desc:"US Federal / gov data"},
    ]},
  { id:"ingestion_pref", icon:"⬇", title:"Ingestion Approach", subtitle:"How data enters your pipeline", field:"ingestion_pref", type:"multi",
    options:[
      {v:"elt",label:"ELT (Load then Transform)",icon:"→",desc:"Fivetran, Airbyte, Stitch"},
      {v:"etl",label:"ETL (Transform in flight)",icon:"⚙",desc:"Talend, Informatica, SSIS"},
      {v:"cdc",label:"CDC / Log-based Replication",icon:"🔄",desc:"Debezium, HVR, Attunity"},
      {v:"streaming",label:"Event Streaming",icon:"⚡",desc:"Kafka Connect, Kinesis"},
      {v:"api_pull",label:"API Pull / Webhooks",icon:"🌐",desc:"Custom connectors"},
      {v:"batch_file",label:"Batch File Transfer",icon:"📁",desc:"SFTP, S3 drop zones"},
    ]},
  { id:"warehouse_pref", icon:"🏛", title:"Warehouse Preference", subtitle:"Existing investments or strong preferences", field:"warehouse_pref", type:"grid",
    options:[
      {v:"snowflake",label:"Snowflake",icon:"❄",desc:"Multi-cloud, auto-scaling"},
      {v:"bigquery",label:"BigQuery",icon:"🔷",desc:"Serverless, GCP-native"},
      {v:"redshift",label:"Redshift",icon:"🔴",desc:"AWS-native, columnar"},
      {v:"synapse",label:"Azure Synapse",icon:"🔵",desc:"Azure-native, unified"},
      {v:"databricks",label:"Databricks",icon:"🧱",desc:"Lakehouse, ML-first"},
      {v:"clickhouse",label:"ClickHouse",icon:"🟡",desc:"Ultra-fast OLAP"},
      {v:"no_pref",label:"No Preference",icon:"🔀",desc:"Best-fit recommendation"},
    ]},
  { id:"output_consumers", icon:"📤", title:"Data Consumers", subtitle:"Who or what uses the processed data?", field:"output_consumers", type:"multi",
    options:[
      {v:"bi",label:"BI / Dashboards",icon:"📊",desc:"Tableau, Power BI, Looker"},
      {v:"ds_notebooks",label:"Data Science Notebooks",icon:"🔬",desc:"Jupyter, Databricks"},
      {v:"ml_models",label:"ML Model Training",icon:"🤖",desc:"Feature pipelines, training"},
      {v:"apis",label:"Operational APIs",icon:"🌐",desc:"REST APIs, microservices"},
      {v:"reverse_etl",label:"Reverse ETL / CRM Sync",icon:"🔁",desc:"Census, Hightouch"},
      {v:"data_sharing",label:"External Data Sharing",icon:"🕸",desc:"Snowflake Share, Delta Share"},
      {v:"alerts",label:"Alerts / Anomaly Detection",icon:"🔔",desc:"Quality SLAs, monitoring"},
      {v:"data_products",label:"Internal Data Products",icon:"📦",desc:"Data mesh, marketplace"},
    ]},
  { id:"rto_rpo", icon:"🛡", title:"Reliability & DR Requirements", subtitle:"Recovery objectives determine replication and HA strategy", field:"rto_rpo", type:"grid",
    options:[
      {v:"best_effort",label:"Best Effort",icon:"😌",desc:"Data loss acceptable, dev/test"},
      {v:"low",label:"Low Criticality",icon:"🟡",desc:"RPO < 24hr, RTO < 8hr"},
      {v:"medium",label:"Medium Criticality",icon:"🟠",desc:"RPO < 1hr, RTO < 2hr"},
      {v:"high",label:"High Availability",icon:"🔴",desc:"RPO < 15min, RTO < 30min"},
    ]},
];

/* ════════════════════════════════════════════════
   COST DATABASE
════════════════════════════════════════════════ */
const COST_DB = {
  "Snowflake":       { base: 800,  unit: "/mo (2 credits/day avg)", optimize: { alt: "ClickHouse OSS", saving: 700, note: "Self-host ClickHouse on EC2 — same query speed, full SQL, higher ops burden." }},
  "BigQuery":        { base: 400,  unit: "/mo (1TB queries/day)",   optimize: { alt: "ClickHouse OSS", saving: 350, note: "BigQuery slot reservations ($1,700/mo) if query volume is predictable." }},
  "Amazon Redshift": { base: 600,  unit: "/mo (dc2.large 2-node)",  optimize: { alt: "Redshift Serverless", saving: 200, note: "Serverless scales to zero on idle — 30–40% cheaper for variable workloads." }},
  "Azure Synapse":   { base: 700,  unit: "/mo (DW200c)",            optimize: { alt: "Synapse Serverless", saving: 300, note: "Use serverless SQL pools for ad-hoc — pay per TB scanned." }},
  "Databricks":      { base: 1200, unit: "/mo (4 DBU avg)",         optimize: { alt: "Databricks SQL Serverless", saving: 400, note: "Use SQL Serverless for BI queries — cheaper than all-purpose clusters." }},
  "ClickHouse":      { base: 200,  unit: "/mo (self-hosted m5.xl)", optimize: null },
  "Fivetran":        { base: 500,  unit: "/mo (~5M rows/mo)",       optimize: { alt: "Airbyte Cloud", saving: 350, note: "Airbyte Open Source self-hosted = $0 connector cost, ~$80/mo infra. Tradeoff: 2–4hr/wk ops." }},
  "Airbyte":         { base: 100,  unit: "/mo (cloud starter)",     optimize: null },
  "Debezium":        { base: 80,   unit: "/mo (infra only)",        optimize: null },
  "Apache Airflow":  { base: 150,  unit: "/mo (MWAA small env)",    optimize: { alt: "Prefect Cloud", saving: 100, note: "Prefect has free tier for <20k runs/mo. Less operational overhead than MWAA." }},
  "AWS MWAA":        { base: 200,  unit: "/mo",                     optimize: { alt: "Prefect OSS", saving: 170, note: "Self-hosted Prefect on EC2 t3.medium — ~$30/mo infra." }},
  "Prefect":         { base: 100,  unit: "/mo (cloud growth)",      optimize: null },
  "Dagster":         { base: 120,  unit: "/mo (cloud starter)",     optimize: null },
  "dbt Core":        { base: 0,    unit: "/mo (open source)",       optimize: null },
  "dbt Core / Cloud":{ base: 0,    unit: "/mo (open source)",       optimize: null },
  "Apache Kafka":    { base: 200,  unit: "/mo (self-hosted 3 broker)", optimize: { alt: "Redpanda Cloud", saving: 120, note: "Redpanda is Kafka-compatible, no ZooKeeper, 3–6x less resource usage." }},
  "Amazon MSK":      { base: 350,  unit: "/mo (kafka.m5.large)",    optimize: { alt: "MSK Serverless", saving: 150, note: "MSK Serverless scales to zero — better for variable throughput workloads." }},
  "Google Pub/Sub":  { base: 80,   unit: "/mo (~100GB msg/mo)",     optimize: null },
  "Azure Event Hubs":{ base: 100,  unit: "/mo (Standard 10 TU)",   optimize: null },
  "Apache Spark":    { base: 300,  unit: "/mo (EMR m5.xlarge 4n)", optimize: { alt: "Databricks SQL", saving: 0, note: "Databricks costs more but reduces engineering time significantly." }},
  "AWS EMR":         { base: 350,  unit: "/mo",                     optimize: { alt: "Glue Serverless", saving: 200, note: "Glue Serverless — no cluster management, pay per DPU-second used." }},
  "Apache Flink":    { base: 250,  unit: "/mo (KDA Flink small)",  optimize: { alt: "Kafka Streams", saving: 200, note: "Kafka Streams runs inside your app — no separate cluster for simpler transformations." }},
  "Amazon S3":       { base: 50,   unit: "/mo (~2TB stored)",       optimize: null },
  "Azure ADLS Gen2": { base: 60,   unit: "/mo (~2TB stored)",       optimize: null },
  "Google Cloud Storage":{ base: 50, unit: "/mo (~2TB stored)",     optimize: null },
  "Tableau":         { base: 840,  unit: "/mo (10 creators)",       optimize: { alt: "Metabase OSS", saving: 820, note: "Metabase Open Source = $0. Covers 80% of Tableau use cases for internal teams." }},
  "Power BI":        { base: 200,  unit: "/mo (10 Pro licenses)",   optimize: null },
  "Looker":          { base: 4000, unit: "/mo (enterprise)",        optimize: { alt: "Looker Studio + dbt", saving: 3980, note: "Looker Studio (free) + dbt semantic layer covers most Looker use cases." }},
  "Metabase":        { base: 0,    unit: "/mo (open source)",       optimize: null },
  "Amazon QuickSight":{ base: 180, unit: "/mo (10 readers)",        optimize: null },
  "Feast":           { base: 80,   unit: "/mo (infra only)",        optimize: null },
  "Census":          { base: 800,  unit: "/mo (starter)",           optimize: { alt: "dbt + custom scripts", saving: 700, note: "Build lightweight reverse ETL with dbt models + Airflow tasks for simple CRM syncs." }},
  "Monte Carlo":     { base: 1000, unit: "/mo (starter)",          optimize: { alt: "Great Expectations OSS", saving: 980, note: "Great Expectations is free, open-source, code-first data quality. Less auto-discovery." }},
  "Great Expectations":{ base: 0, unit: "/mo (open source)",       optimize: null },
  "Apache Atlas":    { base: 100,  unit: "/mo (infra only)",        optimize: null },
  "Microsoft Purview":{ base: 500, unit: "/mo",                    optimize: { alt: "DataHub OSS", saving: 480, note: "LinkedIn's DataHub is fully open-source with similar lineage and catalog capabilities." }},
};

/* ════════════════════════════════════════════════
   ARCHITECTURE ENGINE
════════════════════════════════════════════════ */
function buildArchitecture(inp) {
  const isStreaming = ["streaming","cep"].includes(inp.latency);
  const isAWS = inp.cloud==="aws", isAzure = inp.cloud==="azure", isGCP = inp.cloud==="gcp";
  const isOnPrem = ["onprem","hybrid"].includes(inp.cloud);
  const isBigTeam = ["large","platform"].includes(inp.team);
  const isML = ["ml_platform","data_science"].includes(inp.usecase);
  const isBootstrap = inp.budget==="bootstrap";
  const needsCompliance = inp.compliance && !inp.compliance.includes("none") && inp.compliance.length>0;
  const isLargeScale = ["large","xlarge"].includes(inp.volume);
  const warnings = [];

  // Anti-pattern detection
  if ((inp.latency==="cep"||inp.latency==="streaming") && inp.usecase==="analytics" && !inp.ingestion_pref?.includes("streaming")) {
    warnings.push({ type:"conflict", msg:"⚠ Real-time latency + Analytics use case: Most BI tools can't consume sub-second streams. Consider Lambda architecture or near-real-time (15min) instead." });
  }
  if (isBootstrap && isLargeScale) {
    warnings.push({ type:"cost", msg:"⚠ Bootstrap budget + Large scale: Your data volume will likely exceed open-source limits. Budget constraint vs scale requirement needs resolution." });
  }
  if (inp.team==="solo" && (inp.usecase==="ml_platform"||inp.latency==="cep")) {
    warnings.push({ type:"ops", msg:"⚠ Solo team + ML Platform / CEP: These architectures require significant operational expertise. Consider managed services (SageMaker, Confluent) to reduce burden." });
  }
  if (inp.migration==="migrate_hadoop" && isBootstrap) {
    warnings.push({ type:"migration", msg:"⚠ Hadoop migration + Bootstrap budget: Cloud migration from Hadoop typically costs $50K–$200K in eng time. Ensure budget scope is accurate." });
  }

  // Warehouse selection
  let wh;
  const wp = inp.warehouse_pref;
  if (wp==="snowflake"||(!wp&&!isGCP&&!isAzure&&wp!=="databricks"&&wp!=="clickhouse")) wh={id:"warehouse",label:"Snowflake",sublabel:"Cloud Data Warehouse",category:"warehouse",logo:"Snowflake",why:["Multi-cloud — runs on AWS, Azure, GCP with single control plane","Zero-copy cloning for dev/test environments at no storage cost","Automatic clustering eliminates manual index management","Time Travel (90 days) enables auditing and accidental deletion recovery"],tradeoffs:["Credits model is expensive for always-on large clusters","Snowpark for Python has warm-start latency","Not ideal for sub-100ms serving — use a hot store alongside"],cost_key:"Snowflake",alts:["Redshift","BigQuery","Databricks"]};
  else if (wp==="bigquery"||isGCP) wh={id:"warehouse",label:"BigQuery",sublabel:"Serverless Data Warehouse",category:"warehouse",logo:"BigQuery",why:["Serverless — no cluster sizing, auto-scales to petabytes","Built-in ML via BigQuery ML — train models with SQL","BI Engine in-memory cache for sub-second dashboard queries","Deeply integrated with Vertex AI, Dataflow, Looker"],tradeoffs:["On-demand pricing gets expensive with frequent ad-hoc queries","Slot reservations required for cost-predictable workloads","Limited DML (UPDATE/DELETE) performance vs row-store DBs"],cost_key:"BigQuery",alts:["Snowflake","ClickHouse","Databricks"]};
  else if (wp==="redshift"||isAWS) wh={id:"warehouse",label:"Amazon Redshift",sublabel:"Columnar MPP Warehouse",category:"warehouse",logo:"Amazon Redshift",why:["Tightest AWS integration — S3, Glue, EMR, SageMaker native","Redshift Spectrum queries S3 data without loading","Concurrency Scaling handles burst query demand automatically","RA3 nodes decouple storage from compute"],tradeoffs:["Concurrency Scaling adds cost on burst workloads","Vacuuming needed for heavily updated tables","Snowflake edges it for multi-cloud or complex workloads"],cost_key:"Amazon Redshift",alts:["Snowflake","Databricks","BigQuery"]};
  else if (wp==="synapse"||isAzure) wh={id:"warehouse",label:"Azure Synapse",sublabel:"Unified Analytics Platform",category:"warehouse",logo:"Azure Synapse",why:["Single platform for DW + Spark + SQL — reduces tool sprawl","Native ADLS Gen2 integration with zero-copy reads","Azure AD integration for enterprise SSO and RBAC","Synapse Link for real-time Azure Cosmos DB analytics"],tradeoffs:["Complex setup and steep learning curve","DWUs are less transparent than Snowflake credits","Best only for Azure-committed organizations"],cost_key:"Azure Synapse",alts:["Snowflake","Databricks","BigQuery"]};
  else if (wp==="databricks") wh={id:"warehouse",label:"Databricks",sublabel:"Lakehouse Platform",category:"warehouse",logo:"Databricks",why:["Best platform for unified ETL + SQL + ML workloads","Unity Catalog provides governance across all data assets","Delta Lake ACID transactions on object storage","Photon engine gives 3–8x Spark query acceleration"],tradeoffs:["Higher DBU cost vs standalone Spark on EMR/Dataproc","Vendor lock-in to Delta Lake format","Complex billing model (DBU × cloud VM cost)"],cost_key:"Databricks",alts:["Snowflake","BigQuery","Redshift"]};
  else if (wp==="clickhouse") wh={id:"warehouse",label:"ClickHouse",sublabel:"OLAP Analytics Engine",category:"warehouse",logo:"ClickHouse",why:["Fastest open-source OLAP — sub-second on 100B+ row tables","Columnar compression ratios of 10:1 reduce storage costs","Real-time ingestion directly from Kafka without ETL","MergeTree engine handles time-series and event data natively"],tradeoffs:["Not ideal for complex JOIN-heavy analytical queries","Limited ecosystem vs Snowflake/BigQuery","Requires careful schema design — no flexible schema"],cost_key:"ClickHouse",alts:["Snowflake","BigQuery","Druid"]};
  else wh={id:"warehouse",label:"Snowflake",sublabel:"Cloud Data Warehouse",category:"warehouse",logo:"Snowflake",why:["Recommended: most flexible multi-cloud warehouse","Separation of compute/storage reduces idle costs","Massive ecosystem: dbt, Fivetran, Tableau all first-class"],tradeoffs:["Premium pricing vs cloud-native alternatives","Credits model needs careful warehouse sizing"],cost_key:"Snowflake",alts:["Redshift","BigQuery"]};

  // Orchestration
  let orch;
  const op = inp.orchestration_pref;
  const orchLabel = isAWS?"AWS MWAA":isGCP?"Cloud Composer":isAzure?"Azure Data Factory":"Apache Airflow";
  if (op==="prefect") orch={id:"orchestration",label:"Prefect",sublabel:"Workflow Orchestration",category:"orchestration",logo:"Prefect",why:["Python-native workflows — no XML or YAML config","Dynamic task mapping for data-volume-variable pipelines","Built-in observability with flow run dashboard","Hybrid deployment — run agents on any infra"],tradeoffs:["Smaller community than Airflow (fewer operators)","Prefect 2 is mature but Airflow still dominates job postings","Cloud cost adds up for high-frequency pipelines"],cost_key:"Prefect",alts:["Airflow","Dagster"]};
  else if (op==="dagster") orch={id:"orchestration",label:"Dagster",sublabel:"Asset-based Orchestration",category:"orchestration",logo:"Dagster",why:["Software-defined assets align pipelines with data products","Best lineage and observability of any orchestrator","Type-checked inputs/outputs catch errors at dev time","dbt + Dagster integration is best-in-class"],tradeoffs:["Steepest learning curve of all orchestrators","Smaller community and fewer third-party integrations","Requires rethinking pipelines as assets (mindset shift)"],cost_key:"Dagster",alts:["Airflow","Prefect"]};
  else orch={id:"orchestration",label:orchLabel,sublabel:"Pipeline Orchestration",category:"orchestration",logo:"Apache Airflow",why:["Industry standard — 1000+ operators, massive community","Python DAGs are version-controlled and testable","Rich UI for monitoring, retries, and SLA tracking","Managed options: MWAA, Astronomer, Cloud Composer"],tradeoffs:["Scheduler is a single point of failure (use HA mode)","DAGs are static — dynamic pipelines require workarounds","Operationally heavy to self-host — use managed in prod"],cost_key:orchLabel,alts:["Prefect","Dagster"]};

  // Ingestion
  let ingestNodes = [];
  if (inp.ingestion_pref?.includes("cdc")||inp.sources?.includes("rdbms")) {
    ingestNodes.push({id:"debezium",label:"Debezium",sublabel:"Change Data Capture",category:"ingestion",logo:"Debezium",why:["Log-based CDC — zero query load on source DB","Captures INSERT, UPDATE, DELETE in real-time","Exactly-once delivery with Kafka offset tracking","Supports PostgreSQL, MySQL, Oracle, SQL Server, MongoDB"],tradeoffs:["Requires Kafka as transport layer","Source DB binlog must be enabled (DB admin needed)","Schema changes in source can break consumers"],cost_key:"Debezium",alts:["HVR","Fivetran","Qlik Replicate"]});
  }
  if (inp.ingestion_pref?.includes("elt")||inp.sources?.includes("saas_tools")||!inp.ingestion_pref?.length) {
    const tool = isBootstrap?"Airbyte":"Fivetran";
    ingestNodes.push({id:"elt_tool",label:tool,sublabel:"ELT Connector Platform",category:"ingestion",logo:tool,why: tool==="Fivetran"?["500+ pre-built connectors, all maintained by Fivetran","Automatic schema migration handles source changes","Normalized output schema speeds downstream modeling","99.9% SLA with built-in alerting and monitoring"]:["300+ open-source connectors — community maintained","Self-hosted or Airbyte Cloud — no per-row pricing","Full connector customization via CDK framework","Strong dbt integration for post-load transformations"],tradeoffs: tool==="Fivetran"?["Expensive at scale — per-row pricing above 5M rows/mo","Limited transformation before load","Vendor lock-in to their connector catalog"]:["Operational overhead vs fully managed Fivetran","Some connectors are community-quality (less tested)","Airbyte Cloud still maturing for enterprise SLAs"],cost_key:tool,alts:tool==="Fivetran"?["Airbyte","Stitch","Portable"]:["Fivetran","Stitch","Hevo"]});
  }
  if (isStreaming||inp.sources?.includes("events")||inp.sources?.includes("iot")) {
    const streamTool = isAWS&&!isBigTeam?"Amazon MSK":isGCP?"Google Pub/Sub":isAzure?"Azure Event Hubs":"Apache Kafka";
    ingestNodes.push({id:"kafka",label:streamTool,sublabel:"Event Streaming Platform",category:"streaming",logo:streamTool,why:[`Durable, distributed log — replay events up to ${streamTool==="Amazon MSK"?"7 days":"configurable retention"}`,"Decouples producers from consumers — fan-out to multiple systems","Exactly-once semantics with idempotent producers","Kafka Connect ecosystem for 200+ source/sink connectors"],tradeoffs:[streamTool==="Amazon MSK"?"MSK is ~60% cheaper than Confluent but less feature-rich":"Operationally complex — use managed (MSK, Confluent) in production","Partition key design is critical for hot-spot avoidance","Schema Registry needed to prevent consumer breaking changes"],cost_key:streamTool,alts:["Confluent Cloud","Redpanda","Amazon Kinesis"]});
  }

  // Processing / Transform
  let transformNodes = [];
  if (inp.transform_pref?.includes("spark")||isLargeScale) {
    const sparkLabel = isAWS?"AWS EMR":isGCP?"Dataproc":isAzure?"HDInsight":"Apache Spark";
    transformNodes.push({id:"spark",label:sparkLabel,sublabel:"Distributed Processing",category:"processing",logo:"Apache Spark",why:["Distributed processing at petabyte scale","Rich APIs: PySpark, Spark SQL, Spark Streaming","Unified batch and streaming in one framework","Deep integration with Delta Lake for ACID lakehouse"],tradeoffs:["Cold start latency — clusters take 3–8 min to initialize","High memory requirement for Shuffle operations","Use Databricks for better developer experience on Spark"],cost_key:sparkLabel,alts:["Databricks","Flink","Dask"]});
  }
  if (isStreaming&&(inp.transform_pref?.includes("flink")||inp.latency==="cep")) {
    transformNodes.push({id:"flink",label:"Apache Flink",sublabel:"Stateful Stream Processing",category:"processing",logo:"Apache Flink",why:["True streaming engine — not micro-batch like Spark","Stateful operators with exactly-once semantics","Event-time processing handles late/out-of-order events","Native CEP library for pattern detection in streams"],tradeoffs:["Steepest learning curve of any data framework","State backend (RocksDB) sizing is critical and complex","Managed via Kinesis Data Analytics or Ververica in prod"],cost_key:"Apache Flink",alts:["Spark Streaming","Kafka Streams","Beam"]});
  }
  if (inp.transform_pref?.includes("dbt")||(!inp.transform_pref?.length&&!isStreaming)||inp.transform_pref?.includes("sql")) {
    transformNodes.push({id:"dbt",label:"dbt Core / Cloud",sublabel:"SQL Transformation Layer",category:"transformation",logo:"dbt Core",why:["Version-controlled SQL models with Git workflow","Built-in testing (not-null, unique, referential integrity)","Auto-generated documentation and data lineage DAG","dbt Python models for ML transforms inside warehouse"],tradeoffs:["SQL-only by default — Python models are warehouse-specific","Model run times grow linearly without incremental strategies","dbt Cloud adds cost — use dbt Core + Airflow for budget stacks"],cost_key:"dbt Core / Cloud",alts:["SQLMesh","Coalesce","Matillion"]});
  }

  // Storage
  let storageNode;
  if (isAWS) storageNode={id:"storage",label:"Amazon S3",sublabel:"Data Lake / Object Store",category:"storage",logo:"Amazon S3",why:["11-nines durability — industry gold standard for raw storage","Intelligent Tiering auto-moves cold data to cheaper tiers","S3 Select reduces data scanned for partial reads by 80%","Native integration with Athena, EMR, Glue, Redshift Spectrum"],tradeoffs:["Egress costs can be significant for multi-region","Not queryable directly — needs compute layer on top","Small file problem degrades query performance — use compaction"],cost_key:"Amazon S3",alts:["ADLS Gen2","GCS","MinIO"]};
  else if (isAzure) storageNode={id:"storage",label:"Azure ADLS Gen2",sublabel:"Hierarchical Data Lake",category:"storage",logo:"Azure Synapse",why:["Hierarchical namespace enables atomic directory operations","Fine-grained ACLs at file and folder level via Azure AD","Native Synapse and Databricks integration","Zone-redundant storage (ZRS) for HA without replication cost"],tradeoffs:["Less third-party ecosystem than S3","Hierarchical namespace adds complexity vs flat object store","Egress costs apply for data moving outside Azure region"],cost_key:"Azure ADLS Gen2",alts:["S3","GCS"]};
  else if (isGCP) storageNode={id:"storage",label:"Google Cloud Storage",sublabel:"Object Storage",category:"storage",logo:"Google Cloud Storage",why:["BigQuery external tables enable zero-copy analytics","Strong consistency on all operations (unlike S3 eventual)","Autoclass storage automatically moves objects to cheaper tiers","Multi-region buckets for HA at marginal cost premium"],tradeoffs:["Higher egress costs vs S3 for data leaving GCP","Less mature Delta Lake / Iceberg support vs AWS","BigQuery-external-table pattern adds query latency vs native BQ"],cost_key:"Google Cloud Storage",alts:["S3","ADLS Gen2"]};
  else storageNode={id:"storage",label:"MinIO + HDFS",sublabel:"On-Prem Object Storage",category:"storage",logo:"Amazon S3",why:["MinIO provides S3-compatible API on bare metal","HDFS for legacy Hadoop workloads — familiar to existing teams","Delta Lake on top adds ACID semantics to raw files","Full data sovereignty — data never leaves your network"],tradeoffs:["Full operational burden — storage ops is a full-time job","HDFS NameNode is single point of failure (use HA NameNode)","Total cost of ownership often exceeds cloud after 3 years"],cost_key:"Amazon S3",alts:["S3","GCS","Ceph"]};

  // Serving
  let servingNodes = [];
  if (inp.output_consumers?.includes("apis")||inp.usecase==="customer360") {
    const hotStore = isAWS?"Amazon DynamoDB":isAzure?"Azure Cosmos DB":isGCP?"Cloud Bigtable":"Redis / PostgreSQL";
    servingNodes.push({id:"hot_store",label:hotStore,sublabel:"Low-latency Hot Store",category:"serving",logo:"Amazon S3",why:["Sub-millisecond key-value reads for operational APIs","Pre-computed aggregates served without hitting the warehouse","Scales to millions of reads/sec with consistent performance","TTL-based expiry automatically evicts stale records"],tradeoffs:["Not for analytics — aggregations must be pre-computed","Cost adds up at high read volume (DynamoDB on-demand)","Hot store ↔ warehouse sync needs careful consistency design"],cost_key:"Amazon S3",alts:["Redis","Cassandra","TiKV"]});
  }
  if (isML||inp.output_consumers?.includes("ml_models")) {
    servingNodes.push({id:"feature_store",label:"Feast",sublabel:"ML Feature Store",category:"serving",logo:"Feast",why:["Eliminates training-serving skew — same features at train/infer","Online store (Redis) for <10ms feature retrieval at inference","Offline store (warehouse) for point-in-time correct training sets","Feature sharing across ML teams reduces duplicate work"],tradeoffs:["Self-hosted Feast has significant operational complexity","Tecton or SageMaker Feature Store for managed alternatives","Requires discipline — feature pipelines must be production-grade"],cost_key:"Feast",alts:["Tecton","SageMaker Feature Store","Hopsworks"]});
  }
  if (inp.output_consumers?.includes("reverse_etl")) {
    servingNodes.push({id:"reverse_etl",label:"Census",sublabel:"Reverse ETL",category:"serving",logo:"Census",why:["Syncs warehouse data to 200+ operational tools","Git-based data model for version-controlled syncs","Audience builder for marketing activation from the warehouse","Live syncs can trigger on warehouse model completion"],tradeoffs:["New category — some tools still maturing","Can be replaced with dbt + custom Airflow tasks for basic syncs","$800+/mo cost needs to be justified by activation revenue"],cost_key:"Census",alts:["Hightouch","Grouparoo","Custom Airflow"]});
  }

  // Governance
  let govNode = null;
  if (needsCompliance||isBigTeam||inp.usecase==="compliance_rpt") {
    const govLabel = isAzure?"Microsoft Purview":wp==="databricks"?"Unity Catalog (Databricks)":"Apache Atlas / DataHub";
    govNode={id:"governance",label:govLabel,sublabel:"Data Governance & Catalog",category:"governance",logo:"Microsoft Purview",why:["Automated PII detection and classification across all data assets","Column-level lineage from source to BI layer","Data quality scoring and SLA monitoring","Business glossary linking technical assets to business context"],tradeoffs:["Heavy implementation effort — plan 3–6 months","DataHub (OSS) is production-ready but needs a dedicated platform engineer","Enterprise tools (Collibra, Alation) are $100K+/yr"],cost_key:govLabel,alts:["Collibra","Alation","DataHub","OpenMetadata"]};
  }

  // Visualization
  let vizNode;
  const oc = inp.output_consumers||[];
  if (isBootstrap) {
    vizNode={id:"viz",label:"Metabase",sublabel:"Self-service Analytics",category:"visualization",logo:"Metabase",why:["Free open-source — $0 for unlimited users on self-hosted","SQL editor + point-and-click interface for non-technical users","Embeddable dashboards for customer-facing analytics","Docker deployment in under 10 minutes"],tradeoffs:["Limited enterprise features vs Tableau/Looker","No LookML-style semantic layer — each question is independent","Slower at large query volumes without caching configuration"],cost_key:"Metabase",alts:["Grafana","Apache Superset","Redash"]};
  } else if (isAzure) {
    vizNode={id:"viz",label:"Power BI",sublabel:"Enterprise BI",category:"visualization",logo:"Power BI",why:["Native Synapse/Azure Direct Query integration","Microsoft 365 SSO — zero credential management","Premium features: large models, paginated reports, AI visuals","XMLA endpoint exposes Power BI as Analysis Services"],tradeoffs:["Windows-centric admin experience","Premium capacity ($4,995/mo) needed for large-scale embedding","DirectQuery mode is slower than import mode for large datasets"],cost_key:"Power BI",alts:["Tableau","Looker","Metabase"]};
  } else if (isGCP) {
    vizNode={id:"viz",label:"Looker",sublabel:"Semantic Layer + BI",category:"visualization",logo:"Looker",why:["LookML semantic layer — single source of truth for metrics","Native BigQuery push-down queries — no data movement","Git-based LookML version control for governed metrics","Embedded analytics via Looker Embed API"],tradeoffs:["Expensive — $3K–$10K+/mo for enterprise licenses","LookML requires dedicated learning investment","Looker Studio (free) covers simpler reporting needs"],cost_key:"Looker",alts:["Looker Studio","Tableau","Metabase"]};
  } else {
    vizNode={id:"viz",label:"Tableau",sublabel:"Enterprise Visualization",category:"visualization",logo:"Tableau",why:["Most powerful drag-and-drop analytics in the market","Tableau Prep for visual data prep without code","Server/Cloud with Row-Level Security for multi-tenant access","VizQL engine optimizes queries automatically"],tradeoffs:["Most expensive BI tool — $840+/mo for 10 creators","Tableau Cloud has limited Snowflake Secure Data Sharing support","Heavy install and upgrade process for Tableau Server"],cost_key:"Tableau",alts:["Power BI","Looker","Metabase","Grafana"]};
  }

  // Monitoring
  const monNode = isBootstrap
    ? {id:"monitoring",label:"Great Expectations",sublabel:"Data Quality Testing",category:"governance",logo:"Great Expectations",why:["Code-first quality tests run in your pipeline — free and OSS","Expectation suites document data contracts explicitly","Data Docs generate browsable HTML quality reports","Integrates natively with Airflow, dbt, and Spark"],tradeoffs:["No auto-discovery — you write every expectation manually","Requires Python knowledge to configure","Less visual than Monte Carlo — no auto anomaly detection"],cost_key:"Great Expectations",alts:["Soda","dbt tests","Bigeye"]}
    : {id:"monitoring",label:"Monte Carlo",sublabel:"Data Observability",category:"governance",logo:"Monte Carlo",why:["ML-based anomaly detection — no manual rule writing needed","Automatic data lineage across warehouse and BI tools","Incident management with Slack/PagerDuty integration","SLA monitoring with automated alerting on freshness/volume"],tradeoffs:["$1,000+/mo starting price — hard to justify for small teams","Auto-discovery accuracy is ~85% — some false positives","Vendor lock-in for observability metadata"],cost_key:"Monte Carlo",alts:["Soda","Great Expectations","Bigeye","Acceldata"]};

  // Layout
  const nodeList = [
    {id:"source",x:20,y:180,label:"Data Sources",sublabel:(inp.sources||[]).slice(0,2).map(s=>s.replace("_"," ")).join(", ")||"DBs · APIs · Files",category:"source",logo:null,why:["Entry point for all raw data — operational DBs, SaaS tools, event streams","Data quality and schema stability here impacts entire pipeline","Document data contracts at this layer to prevent downstream breakage","Consider data classification (PII, sensitive) at ingestion boundary"],tradeoffs:["Schema changes in source systems cascade downstream — enforce contracts","Volume spikes at source can overwhelm ingestion layer — add backpressure","Avoid polling — push-based (CDC/webhooks) is always preferable to pull"],cost_key:null,alts:[]},
    ...ingestNodes.map((n,i)=>({...n,x:220,y:80+i*170})),
    {...storageNode,x:440,y:180},
    ...(govNode?[{...govNode,x:440,y:390}]:[]),
    ...transformNodes.map((n,i)=>({...n,x:660,y:80+i*170})),
    {...orch,x:660,y:380},
    {...wh,x:880,y:180},
    ...servingNodes.map((n,i)=>({...n,x:1100,y:80+i*150})),
    {...vizNode,x:1320,y:180},
    {...monNode,x:1320,y:360},
  ];

  const edgeList = [
    {from:"source",to:ingestNodes[0]?.id||"elt_tool",label:"raw"},
    ...ingestNodes.map(n=>({from:n.id,to:"storage",label:"landed"})),
    {from:"storage",to:transformNodes[0]?.id||"dbt",label:"read"},
    ...(transformNodes.length>1?[{from:transformNodes[0].id,to:transformNodes[1].id,label:""}]:[]),
    {from:transformNodes[transformNodes.length-1].id,to:"warehouse",label:"models"},
    {from:"orchestration",to:transformNodes[0].id,label:"triggers"},
    {from:"warehouse",to:"viz",label:"query"},
    {from:"warehouse",to:"monitoring",label:"observe"},
    ...(govNode?[{from:"storage",to:"governance",label:"scan"},{from:"warehouse",to:"governance",label:"lineage"}]:[]),
    ...servingNodes.map(n=>({from:"warehouse",to:n.id,label:"sync"})),
    ...(ingestNodes.find(n=>n.id==="kafka")?[{from:"kafka",to:transformNodes[0]?.id||"dbt",label:"stream"}]:[]),
  ];

  const cloudLabel={aws:"AWS",azure:"Azure",gcp:"GCP",onprem:"On-Premises",hybrid:"Hybrid",multicloud:"Multi-Cloud"}[inp.cloud]||"Cloud";
  const usecaseLabel={analytics:"Analytics",ml_platform:"ML Platform",realtime:"Real-time",lakehouse:"Lakehouse",cdc:"CDC",data_science:"Data Science",customer360:"Customer 360",compliance_rpt:"Compliance"}[inp.usecase]||"Data";

  return {
    title:`${cloudLabel} ${usecaseLabel} Architecture`,
    summary:`End-to-end ${usecaseLabel.toLowerCase()} pipeline on ${cloudLabel} · ${["streaming","cep"].includes(inp.latency)?"Real-time streaming":"Batch/near-real-time"} · ${isBigTeam?"Enterprise-grade":"Team-optimized"} tooling`,
    nodes:nodeList, edges:edgeList, warnings,
    tags:[cloudLabel,usecaseLabel,["streaming","cep"].includes(inp.latency)?"Streaming":"Batch",inp.team==="large"||inp.team==="platform"?"Enterprise":"SMB",needsCompliance?"Compliance-Ready":"Standard"],
    estCost:{aws:"$1,200–2,800",azure:"$1,100–2,500",gcp:"$900–2,200",onprem:"$400–900",hybrid:"$800–1,800",multicloud:"$1,500–3,500"}[inp.cloud]||"$1,000–2,500",
  };
}

/* ════════════════════════════════════════════════
   COST SIMULATOR
════════════════════════════════════════════════ */
function CostSimulator({ nodes, onClose }) {
  const [optimized, setOptimized] = useState(false);
  const items = nodes.map(n => {
    const db = COST_DB[n.label] || COST_DB[n.label?.split(" ")[0]];
    if (!db) return null;
    return { ...n, ...db };
  }).filter(Boolean);

  const total = items.reduce((s,i)=>s+(i.base||0),0);
  const savedTotal = items.reduce((s,i)=>s+(optimized&&i.optimize?i.optimize.saving:0),0);
  const optimizedTotal = total - savedTotal;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(3,5,8,0.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",padding:24}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,width:"100%",maxWidth:720,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bgDeep}}>
          <div>
            <div style={{color:C.textHi,fontWeight:800,fontSize:16,fontFamily:"'Syne',sans-serif"}}>💰 Cost Simulator</div>
            <div style={{color:C.textLo,fontSize:11,marginTop:2}}>Monthly infrastructure estimate · All figures approximate</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={()=>setOptimized(o=>!o)} style={{padding:"7px 16px",borderRadius:8,border:`1px solid ${optimized?C.green:C.border}`,background:optimized?C.green+"18":"transparent",color:optimized?C.green:C.textDim,cursor:"pointer",fontSize:11,fontFamily:"'Syne Mono',monospace",transition:"all 0.2s"}}>
              {optimized?"✓ Showing Optimized":"⚡ Show Optimized Stack"}
            </button>
            <button onClick={onClose} style={{width:32,height:32,borderRadius:8,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textLo,cursor:"pointer",fontSize:16}}>✕</button>
          </div>
        </div>
        {/* Cost table */}
        <div style={{flex:1,overflowY:"auto",padding:20}}>
          {items.map(item=>{
            const cat = CAT[item.category]||CAT.ingestion;
            const hasOpt = !!item.optimize;
            return (
              <div key={item.id} style={{marginBottom:10,padding:"14px 16px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                    <div style={{width:28,height:28,borderRadius:6,background:cat.color+"18",border:`1px solid ${cat.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:cat.color,flexShrink:0}}>{cat.glyph}</div>
                    <div style={{flex:1}}>
                      <div style={{color:C.text,fontWeight:600,fontSize:12,fontFamily:"'Syne',sans-serif"}}>{item.label}</div>
                      <div style={{color:C.textLo,fontSize:10}}>{item.unit}</div>
                      {optimized&&hasOpt&&(
                        <div style={{marginTop:6,padding:"6px 10px",background:C.green+"10",border:`1px solid ${C.green}30`,borderRadius:6}}>
                          <div style={{color:C.green,fontSize:10,fontWeight:700,fontFamily:"'Syne Mono',monospace",marginBottom:2}}>→ OPTIMIZE: {item.optimize.alt}</div>
                          <div style={{color:C.textDim,fontSize:10,lineHeight:1.5}}>{item.optimize.note}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{color:optimized&&hasOpt?C.textLo:C.amber,fontSize:14,fontWeight:800,fontFamily:"'Syne Mono',monospace",textDecoration:optimized&&hasOpt?"line-through":"none"}}>
                      ${item.base.toLocaleString()}<span style={{fontSize:9,fontWeight:400}}>/mo</span>
                    </div>
                    {optimized&&hasOpt&&(
                      <div style={{color:C.green,fontSize:13,fontWeight:800,fontFamily:"'Syne Mono',monospace"}}>
                        ${(item.base-(item.optimize?.saving||0)).toLocaleString()}<span style={{fontSize:9,fontWeight:400}}>/mo</span>
                      </div>
                    )}
                    {hasOpt&&!optimized&&<div style={{color:C.green,fontSize:10,fontFamily:"'Syne Mono',monospace"}}>save ~${item.optimize.saving.toLocaleString()}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Footer total */}
        <div style={{padding:"16px 24px",borderTop:`1px solid ${C.border}`,background:C.bgDeep,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:C.textLo,fontSize:10,fontFamily:"'Syne Mono',monospace"}}>ESTIMATED MONTHLY TOTAL</div>
            {optimized&&savedTotal>0&&<div style={{color:C.green,fontSize:11,marginTop:2}}>💚 Saving ~${savedTotal.toLocaleString()}/mo vs original stack</div>}
          </div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            {optimized&&savedTotal>0&&<div style={{color:C.textLo,fontSize:18,fontWeight:800,fontFamily:"'Syne Mono',monospace",textDecoration:"line-through"}}>${total.toLocaleString()}</div>}
            <div style={{color:optimized&&savedTotal>0?C.green:C.amber,fontSize:24,fontWeight:800,fontFamily:"'Syne Mono',monospace"}}>${optimizedTotal.toLocaleString()}<span style={{fontSize:12,color:C.textLo,fontWeight:400}}>/mo</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SVG EDGE
════════════════════════════════════════════════ */
function SVGEdge({from,to,nodes,label}) {
  const fn=nodes.find(n=>n.id===from),tn=nodes.find(n=>n.id===to);
  if(!fn||!tn)return null;
  const nw=164,nh=68,x1=fn.x+nw,y1=fn.y+nh/2,x2=tn.x,y2=tn.y+nh/2,mx=(x1+x2)/2;
  const id=`e${from}${to}`.replace(/[^a-z0-9]/gi,"");
  const cat=CAT[fn.category]||CAT.ingestion;
  return (
    <g>
      <defs>
        <linearGradient id={`g${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={cat.color} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={C.cyan} stopOpacity="0.5"/>
        </linearGradient>
        <marker id={`a${id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0,6 3,0 6" fill={C.cyan} opacity="0.6"/>
        </marker>
      </defs>
      <path id={`p${id}`} d={`M${x1} ${y1} C${mx} ${y1},${mx} ${y2},${x2} ${y2}`} fill="none" stroke={`url(#g${id})`} strokeWidth="1.5" markerEnd={`url(#a${id})`}/>
      {label&&<text fontSize="7.5" fill={C.textLo} textAnchor="middle" fontFamily="'Syne Mono',monospace"><textPath href={`#p${id}`} startOffset="50%">{label}</textPath></text>}
      <circle r="2.5" fill={C.cyan} opacity="0.9">
        <animateMotion dur={`${2.2+Math.random()*2}s`} repeatCount="indefinite"><mpath href={`#p${id}`}/></animateMotion>
      </circle>
    </g>
  );
}

/* ════════════════════════════════════════════════
   ARCH NODE (with logo)
════════════════════════════════════════════════ */
function ArchNode({node,selected,onClick,delay=0}) {
  const cat=CAT[node.category]||CAT.ingestion;
  const isSel=selected===node.id;
  const logoUrl=TOOL_LOGO_MAP[node.label];
  const [imgErr,setImgErr]=useState(false);
  return (
    <g transform={`translate(${node.x},${node.y})`} onClick={()=>onClick(node)} style={{cursor:"pointer"}}>
      <style>{`.nd${node.id.replace(/[^a-z0-9]/gi,"")}{opacity:0;animation:ndIn .5s ${delay}s ease forwards}@keyframes ndIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <g className={`nd${node.id.replace(/[^a-z0-9]/gi,"")}`}>
        <rect width="162" height="66" rx="10" fill={isSel?cat.color+"1E":C.surface} stroke={isSel?cat.color:C.border} strokeWidth={isSel?2:1}
          style={{filter:isSel?`drop-shadow(0 0 18px ${cat.color}50)`:"none",transition:"all 0.2s"}}/>
        <rect width="3" height="66" rx="1.5" fill={cat.color} opacity={isSel?1:0.7}/>
        {isSel&&<rect x="3" y="0" width="159" height="2" rx="1" fill={cat.color} opacity="0.5"/>}
        {/* Logo or glyph */}
        {logoUrl&&!imgErr?(
          <image href={logoUrl} x="11" y="10" width="20" height="20" onError={()=>setImgErr(true)} style={{objectFit:"contain"}}/>
        ):(
          <text x="14" y="26" fontSize="13" fill={cat.color} fontFamily="'Syne Mono',monospace">{cat.glyph}</text>
        )}
        <text x="38" y="23" fontSize="10.5" fill={isSel?C.textHi:C.text} fontWeight="700" fontFamily="'Syne',sans-serif">{node.label?.slice(0,18)}</text>
        <text x="12" y="40" fontSize="8" fill={C.textLo} fontFamily="'Syne Mono',monospace">{node.sublabel?.slice(0,26)}</text>
        <rect x="12" y="48" width={Math.min(cat.label.length*6+12,80)} height="12" rx="6" fill={cat.color+"18"}/>
        <text x={12+Math.min(cat.label.length*6+12,80)/2} y="57" fontSize="7" fill={cat.color} textAnchor="middle" fontFamily="'Syne Mono',monospace">{cat.label}</text>
      </g>
    </g>
  );
}

/* ════════════════════════════════════════════════
   DETAIL PANEL (with bullet points + logo)
════════════════════════════════════════════════ */
function DetailPanel({node,onClose}) {
  if(!node)return null;
  const cat=CAT[node.category]||CAT.ingestion;
  const logoUrl=TOOL_LOGO_MAP[node.label];
  const [imgErr,setImgErr]=useState(false);
  return (
    <div style={{position:"absolute",right:0,top:0,bottom:0,width:360,background:C.surface,borderLeft:`1px solid ${C.border}`,overflowY:"auto",zIndex:50,animation:"panelIn .3s ease",fontFamily:"'Syne',sans-serif"}}>
      <style>{`@keyframes panelIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      {/* Header */}
      <div style={{padding:"20px",borderBottom:`1px solid ${C.border}`,background:C.bgDeep,position:"sticky",top:0,zIndex:1}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textLo,cursor:"pointer",width:28,height:28,borderRadius:7,fontSize:13}}>✕</button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:44,height:44,borderRadius:10,background:cat.color+"18",border:`1px solid ${cat.color}40`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
            {logoUrl&&!imgErr?<img src={logoUrl} style={{width:28,height:28,objectFit:"contain"}} onError={()=>setImgErr(true)}/>:<span style={{color:cat.color,fontSize:20}}>{cat.glyph}</span>}
          </div>
          <div>
            <div style={{color:C.textHi,fontWeight:800,fontSize:15}}>{node.label}</div>
            <div style={{color:cat.color,fontSize:9,fontFamily:"'Syne Mono',monospace",letterSpacing:1,marginTop:2}}>{cat.label} LAYER</div>
          </div>
        </div>
        <div style={{color:C.textDim,fontSize:11,lineHeight:1.5}}>{node.sublabel}</div>
      </div>
      {/* Bullets */}
      <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
        {[
          {label:"WHY THIS TOOL",items:node.why||[],color:C.cyan,icon:"◎"},
          {label:"TRADEOFFS",items:node.tradeoffs||[],color:C.amber,icon:"⚖"},
        ].map(({label,items,color,icon})=>(
          <div key={label} style={{padding:"14px 16px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <span style={{color,fontSize:10}}>{icon}</span>
              <span style={{color,fontSize:9,fontWeight:700,letterSpacing:1.5,fontFamily:"'Syne Mono',monospace"}}>{label}</span>
            </div>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:6}}>
              {(items||[]).map((item,i)=>(
                <li key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{color,fontSize:8,marginTop:3,flexShrink:0}}>▸</span>
                  <span style={{color:C.textDim,fontSize:11,lineHeight:1.55}}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Cost */}
        {node.cost_key&&COST_DB[node.cost_key]&&(
          <div style={{padding:"14px 16px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <span style={{color:C.green,fontSize:10}}>$</span>
              <span style={{color:C.green,fontSize:9,fontWeight:700,letterSpacing:1.5,fontFamily:"'Syne Mono',monospace"}}>COST</span>
            </div>
            <div style={{color:C.amber,fontSize:16,fontWeight:800,fontFamily:"'Syne Mono',monospace"}}>
              ~${COST_DB[node.cost_key].base.toLocaleString()}<span style={{fontSize:10,color:C.textLo,fontWeight:400}}>{COST_DB[node.cost_key].unit}</span>
            </div>
            {COST_DB[node.cost_key].optimize&&(
              <div style={{marginTop:10,padding:"8px 10px",background:C.green+"10",border:`1px solid ${C.green}30`,borderRadius:7}}>
                <div style={{color:C.green,fontSize:9,fontWeight:700,fontFamily:"'Syne Mono',monospace",marginBottom:3}}>💡 OPTIMIZE → {COST_DB[node.cost_key].optimize.alt}</div>
                <div style={{color:C.textDim,fontSize:10,lineHeight:1.5}}>{COST_DB[node.cost_key].optimize.note}</div>
                <div style={{color:C.green,fontSize:11,fontWeight:800,fontFamily:"'Syne Mono',monospace",marginTop:4}}>Save ~${COST_DB[node.cost_key].optimize.saving.toLocaleString()}/mo</div>
              </div>
            )}
          </div>
        )}
        {/* Alternatives */}
        {node.alts?.length>0&&(
          <div style={{padding:"12px 16px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
            <div style={{color:C.textLo,fontSize:9,fontWeight:700,letterSpacing:1.5,fontFamily:"'Syne Mono',monospace",marginBottom:8}}>ALTERNATIVES</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {node.alts.map(a=><span key={a} style={{padding:"3px 10px",borderRadius:4,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.textDim,fontSize:10,fontFamily:"'Syne Mono',monospace"}}>{a}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   WIZARD OPTION CARD
════════════════════════════════════════════════ */
function OptionCard({opt,selected,onClick,multi}) {
  const isSel=multi?(selected||[]).includes(opt.v):selected===opt.v;
  return (
    <button onClick={()=>onClick(opt.v)} style={{background:isSel?C.cyanGlow:C.surface,border:`1.5px solid ${isSel?C.cyan:C.border}`,borderRadius:10,padding:"13px 15px",cursor:"pointer",textAlign:"left",transition:"all 0.15s",boxShadow:isSel?`0 0 24px ${C.cyanGlow}`:isSel?"none":"none",position:"relative",overflow:"hidden"}}>
      {isSel&&<div style={{position:"absolute",top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${C.cyan},transparent)`}}/>}
      <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
        <span style={{fontSize:18,lineHeight:1.2,flexShrink:0}}>{opt.icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{color:isSel?C.cyan:C.text,fontWeight:700,fontSize:11.5,fontFamily:"'Syne',sans-serif",marginBottom:2}}>{opt.label}</div>
          <div style={{color:C.textLo,fontSize:10,lineHeight:1.35}}>{opt.desc}</div>
        </div>
        {multi&&isSel&&<div style={{width:14,height:14,borderRadius:3,background:C.cyan,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.bg,fontWeight:900,flexShrink:0}}>✓</div>}
      </div>
    </button>
  );
}

/* ════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════ */
export default function App() {
  const [phase,setPhase]=useState("landing");
  const [step,setStep]=useState(0);
  const [inputs,setInputs]=useState({});
  const [arch,setArch]=useState(null);
  const [selNode,setSelNode]=useState(null);
  const [showCost,setShowCost]=useState(false);
  const [genIdx,setGenIdx]=useState(0);

  const curStep=STEPS[step];
  const isMulti=curStep?.type==="multi";
  const curVal=inputs[curStep?.field];
  const canNext=isMulti?(curVal?.length>0):!!curVal;

  const GEN=[
    "Parsing your requirements...",
    "Evaluating 40+ data tools...",
    "Selecting ingestion strategy...",
    "Optimizing for "+({aws:"AWS",azure:"Azure",gcp:"GCP",onprem:"on-premises",hybrid:"hybrid cloud",multicloud:"multi-cloud"}[inputs.cloud]||"your cloud")+"...",
    "Applying compliance rules...",
    "Sizing infrastructure costs...",
    "Detecting anti-patterns...",
    "Wiring data flow diagram...",
  ];

  useEffect(()=>{
    if(phase!=="generating")return;
    let i=0;const t=setInterval(()=>{i++;setGenIdx(i%GEN.length)},700);
    const done=setTimeout(()=>{clearInterval(t);setArch(buildArchitecture(inputs));setPhase("diagram")},5500);
    return()=>{clearInterval(t);clearTimeout(done)};
  },[phase]);

  const handleChange=(val)=>setInputs(p=>({...p,[curStep.field]:val}));
  const handleNext=()=>step<STEPS.length-1?setStep(s=>s+1):setPhase("generating");
  const handleBack=()=>step>0&&setStep(s=>s-1);
  const reset=()=>{setPhase("landing");setStep(0);setInputs({});setArch(null);setSelNode(null)};

  const GLOBAL_STYLE=`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes scanline{0%{top:-5%}100%{top:105%}}
    @keyframes shimmer{0%{left:-100%}100%{left:200%}}
    button{font-family:'Syne',sans-serif}
  `;

  /* ─ LANDING ─ */
  if(phase==="landing") return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",fontFamily:"'Syne',sans-serif"}}>
      <style>{GLOBAL_STYLE}</style>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(26,45,71,.45) 1px,transparent 1px),linear-gradient(90deg,rgba(26,45,71,.45) 1px,transparent 1px)`,backgroundSize:"44px 44px"}}/>
      <div style={{position:"absolute",left:0,right:0,height:"1px",background:`linear-gradient(90deg,transparent,${C.cyan}55,transparent)`,animation:"scanline 7s linear infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"25%",left:"35%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${C.cyan}08,transparent 65%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"20%",right:"20%",width:380,height:380,borderRadius:"50%",background:`radial-gradient(circle,${C.violet}07,transparent 65%)`,pointerEvents:"none"}}/>
      <div style={{position:"relative",textAlign:"center",maxWidth:680,padding:"0 24px",animation:"fadeUp .9s ease"}}>
        {/* Logo mark */}
        <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div style={{width:42,height:42,borderRadius:11,background:`linear-gradient(135deg,${C.cyan},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 0 30px ${C.cyan}40`}}>⚡</div>
          <span style={{color:C.cyan,fontWeight:800,fontSize:22,fontFamily:"'Syne Mono',monospace",letterSpacing:"-1px"}}>ArchIQ</span>
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,marginBottom:24,marginLeft:8}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite",display:"inline-block"}}/>
          <span style={{color:C.textLo,fontSize:10,fontFamily:"'Syne Mono',monospace",letterSpacing:.8}}>AI DATA ARCHITECTURE GENERATOR</span>
        </div>
        <h1 style={{fontSize:"clamp(38px,6.5vw,70px)",fontWeight:800,letterSpacing:"-2px",lineHeight:1.05,marginBottom:18,color:C.textHi}}>
          Your Data Pipeline,<br/>
          <span style={{color:"transparent",backgroundImage:`linear-gradient(135deg,${C.cyan} 0%,${C.green} 100%)`,WebkitBackgroundClip:"text",backgroundClip:"text"}}>Architected by AI</span>
        </h1>
        <p style={{color:C.textDim,fontSize:15,lineHeight:1.75,maxWidth:500,margin:"0 auto 36px"}}>
          Answer 15 questions. Get a production-ready end-to-end data architecture with real tool logos, expert reasoning, cost breakdown, and optimization suggestions.
        </p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:36}}>
          {["15 Parameters","40+ Tools Evaluated","Real Tool Logos","Cost Simulator","Anti-pattern Detection","Optimization Tips"].map(t=>(
            <span key={t} style={{padding:"4px 12px",borderRadius:20,background:C.surface,border:`1px solid ${C.border}`,color:C.textDim,fontSize:10,fontFamily:"'Syne Mono',monospace"}}>{t}</span>
          ))}
        </div>
        <button onClick={()=>setPhase("wizard")} style={{background:`linear-gradient(135deg,${C.cyan},${C.cyanDim})`,border:"none",color:C.bg,padding:"16px 52px",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",letterSpacing:".3px",boxShadow:`0 0 40px ${C.cyan}40,0 4px 24px rgba(0,0,0,.5)`,animation:"float 3s ease-in-out infinite"}}>
          Build My Architecture →
        </button>
        <div style={{display:"flex",gap:36,justifyContent:"center",marginTop:40}}>
          {[["15","Input Parameters"],["40+","Tools in Engine"],["6","Cloud Targets"],["∞","Architecture Patterns"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{color:C.cyan,fontSize:20,fontWeight:800,fontFamily:"'Syne Mono',monospace"}}>{n}</div>
              <div style={{color:C.textLo,fontSize:10,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─ WIZARD ─ */
  if(phase==="wizard") return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Syne',sans-serif"}}>
      <style>{GLOBAL_STYLE}</style>
      {/* Top nav */}
      <div style={{height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",borderBottom:`1px solid ${C.border}`,background:C.surface+"95",backdropFilter:"blur(14px)",position:"sticky",top:0,zIndex:100,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.cyan},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>⚡</div>
          <span style={{color:C.cyan,fontWeight:800,fontSize:13,fontFamily:"'Syne Mono',monospace"}}>ArchIQ</span>
        </div>
        {/* Progress bar */}
        <div style={{flex:1,maxWidth:400,margin:"0 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:10,color:C.textLo,fontFamily:"'Syne Mono',monospace"}}>Step {step+1} of {STEPS.length}</span>
            <span style={{fontSize:10,color:C.cyan,fontFamily:"'Syne Mono',monospace"}}>{Math.round(step/STEPS.length*100)}%</span>
          </div>
          <div style={{height:3,background:C.border,borderRadius:2}}>
            <div style={{height:"100%",width:`${step/STEPS.length*100}%`,background:`linear-gradient(90deg,${C.cyan},${C.green})`,borderRadius:2,transition:"width .4s ease"}}/>
          </div>
        </div>
        <button onClick={reset} style={{background:"none",border:`1px solid ${C.border}`,color:C.textLo,borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11}}>✕ Exit</button>
      </div>

      <div style={{flex:1,display:"flex",maxWidth:1080,margin:"0 auto",width:"100%",padding:"32px 24px",gap:0}}>
        {/* Left sidebar nav */}
        <div style={{width:210,flexShrink:0,marginRight:36}}>
          {STEPS.map((s,i)=>(
            <div key={s.id} onClick={()=>i<step&&setStep(i)}
              style={{display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:8,marginBottom:2,
                background:i===step?`${C.cyan}12`:i<step?C.surface+"60":"transparent",
                border:`1px solid ${i===step?C.borderHi:i<step?C.border:"transparent"}`,
                cursor:i<step?"pointer":i===step?"default":"not-allowed",opacity:i>step?.3:1,transition:"all .2s"}}>
              <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontFamily:"'Syne Mono',monospace",fontWeight:700,
                background:i<step?`${C.cyan}22`:i===step?`${C.cyan}18`:C.surface,
                border:`1.5px solid ${i<step?C.cyan:i===step?`${C.cyan}88`:C.border}`,
                color:i<step?C.cyan:i===step?C.textHi:C.textLo}}>
                {i<step?"✓":i+1}
              </div>
              <div style={{overflow:"hidden"}}>
                <div style={{color:i===step?C.textHi:i<step?C.textDim:C.textLo,fontSize:10.5,fontWeight:i===step?700:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.title}</div>
                {i<step&&inputs[s.field]&&<div style={{color:C.cyan,fontSize:8.5,fontFamily:"'Syne Mono',monospace",marginTop:1}}>
                  {Array.isArray(inputs[s.field])?`${inputs[s.field].length} selected`:String(inputs[s.field]).slice(0,12)}
                </div>}
              </div>
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
          <div key={step} style={{animation:"fadeUp .35s ease",flex:1}}>
            <div style={{marginBottom:22,textAlign:"center"}}>
              <span style={{fontSize:32}}>{curStep.icon}</span>
              <h2 style={{color:C.textHi,fontSize:20,fontWeight:800,margin:"8px 0 4px",letterSpacing:"-.5px"}}>{curStep.title}</h2>
              <p style={{color:C.textLo,fontSize:12,lineHeight:1.5}}>{curStep.subtitle}</p>
              {isMulti&&<p style={{color:C.cyan,fontSize:10,fontFamily:"'Syne Mono',monospace",marginTop:4}}>SELECT ALL THAT APPLY</p>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:curStep.options.length>6?"repeat(3,1fr)":"repeat(2,1fr)",gap:9}}>
              {curStep.options.map(opt=><OptionCard key={opt.v} opt={opt} selected={curVal} onClick={v=>handleChange(isMulti?(curVal||[]).includes(v)?(curVal||[]).filter(x=>x!==v):[...(curVal||[]),v]:v)} multi={isMulti}/>)}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24,paddingTop:18,borderTop:`1px solid ${C.border}`,flexShrink:0}}>
            <button onClick={handleBack} disabled={step===0} style={{background:"none",border:`1px solid ${C.border}`,color:step===0?C.textLo:C.textDim,borderRadius:8,padding:"10px 22px",cursor:step===0?"default":"pointer",fontSize:12,opacity:step===0?.4:1}}>← Back</button>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              {isMulti&&<span style={{color:C.textLo,fontSize:10,fontFamily:"'Syne Mono',monospace"}}>{(curVal||[]).length} selected</span>}
              <button onClick={handleNext} disabled={!canNext} style={{background:canNext?`linear-gradient(135deg,${C.cyan},${C.cyanDim})`:C.border,border:"none",color:canNext?C.bg:C.textLo,borderRadius:9,padding:"11px 28px",cursor:canNext?"pointer":"not-allowed",fontSize:13,fontWeight:800,transition:"all .2s",boxShadow:canNext?`0 0 28px ${C.cyan}35`:"none"}}>
                {step===STEPS.length-1?"Generate Architecture ⚡":"Continue →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─ GENERATING ─ */
  if(phase==="generating") return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",position:"relative",overflow:"hidden"}}>
      <style>{GLOBAL_STYLE}</style>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(26,45,71,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(26,45,71,.4) 1px,transparent 1px)`,backgroundSize:"44px 44px"}}/>
      <div style={{position:"absolute",top:"50%",left:"50%",width:700,height:700,borderRadius:"50%",background:`radial-gradient(circle,${C.cyan}07,transparent 55%)`,transform:"translate(-50%,-50%)"}}/>
      <div style={{position:"relative",textAlign:"center"}}>
        <div style={{position:"relative",width:96,height:96,margin:"0 auto 28px"}}>
          {[0,1,2].map(i=><div key={i} style={{position:"absolute",inset:i*14,border:`1.5px solid ${C.border}`,borderTop:`1.5px solid ${[C.cyan,C.green,C.violet][i]}`,borderRadius:"50%",animation:`spin ${[1,.7,1.4][i]}s linear infinite ${i%2?"reverse":""}`}}/>)}
          <div style={{position:"absolute",inset:42,borderRadius:"50%",background:C.cyan,boxShadow:`0 0 20px ${C.cyan}`}}/>
        </div>
        <h2 style={{color:C.textHi,fontSize:20,fontWeight:800,marginBottom:6}}>Building Your Architecture</h2>
        <p style={{color:C.cyan,fontFamily:"'Syne Mono',monospace",fontSize:11,marginBottom:28,minHeight:18}}>{GEN[genIdx]}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",maxWidth:500,margin:"0 auto"}}>
          {["Kafka","Snowflake","dbt","Airflow","Spark","Fivetran","Delta Lake","Flink","Databricks","Monte Carlo","Feast","Census"].map((t,i)=>(
            <div key={t} style={{padding:"4px 11px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,fontSize:9.5,color:C.textLo,fontFamily:"'Syne Mono',monospace",animation:`pulse 2.2s ${i*.18}s infinite`}}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─ DIAGRAM ─ */
  if(phase==="diagram"&&arch) {
    const svgW=Math.max(...arch.nodes.map(n=>n.x))+240;
    const svgH=Math.max(...arch.nodes.map(n=>n.y))+140;
    return (
      <div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.bg,fontFamily:"'Syne',sans-serif"}}>
        <style>{GLOBAL_STYLE}</style>
        {showCost&&<CostSimulator nodes={arch.nodes} onClose={()=>setShowCost(false)}/>}

        {/* Header */}
        <div style={{height:56,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",borderBottom:`1px solid ${C.border}`,background:C.surface+"A0",backdropFilter:"blur(12px)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.cyan},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>⚡</div>
              <span style={{color:C.cyan,fontWeight:800,fontSize:13,fontFamily:"'Syne Mono',monospace"}}>ArchIQ</span>
            </div>
            <div style={{width:1,height:22,background:C.border}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:C.textHi,fontWeight:700,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{arch.title}</div>
              <div style={{color:C.textLo,fontSize:10,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:520}}>{arch.summary}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <div style={{textAlign:"right",marginRight:4}}>
              <div style={{color:C.green,fontWeight:800,fontSize:14,fontFamily:"'Syne Mono',monospace"}}>{arch.estCost}</div>
              <div style={{color:C.textLo,fontSize:9}}>est. monthly</div>
            </div>
            <button onClick={()=>setShowCost(true)} style={{background:C.green+"18",border:`1px solid ${C.green}50`,color:C.green,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:11,fontWeight:700}}>💰 Cost Breakdown</button>
            <button onClick={reset} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.textDim,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:11}}>← Redesign</button>
            <button style={{background:`linear-gradient(135deg,${C.cyan},${C.cyanDim})`,border:"none",color:C.bg,borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:11,fontWeight:800}}>Export ↓</button>
          </div>
        </div>

        {/* Warnings */}
        {arch.warnings?.length>0&&(
          <div style={{padding:"8px 20px",borderBottom:`1px solid ${C.border}`,background:`${C.amber}08`,display:"flex",gap:8,flexWrap:"wrap",flexShrink:0}}>
            {arch.warnings.map((w,i)=>(
              <div key={i} style={{padding:"5px 12px",background:`${C.amber}15`,border:`1px solid ${C.amber}40`,borderRadius:6,fontSize:10,color:C.amber,fontFamily:"'Syne Mono',monospace"}}>{w.msg}</div>
            ))}
          </div>
        )}

        {/* Tag bar */}
        <div style={{height:34,display:"flex",alignItems:"center",gap:8,padding:"0 20px",borderBottom:`1px solid ${C.border}`,background:C.bgDeep,flexShrink:0,overflowX:"auto"}}>
          <span style={{color:C.textLo,fontSize:9.5,fontFamily:"'Syne Mono',monospace",flexShrink:0}}>TAGS:</span>
          {arch.tags.map(t=><span key={t} style={{padding:"2px 9px",borderRadius:4,background:`${C.cyan}14`,border:`1px solid ${C.cyan}35`,color:C.cyan,fontSize:9,fontFamily:"'Syne Mono',monospace",whiteSpace:"nowrap"}}>{t}</span>)}
          <div style={{marginLeft:"auto",display:"flex",gap:12,flexShrink:0}}>
            {Object.entries(CAT).slice(0,7).map(([k,v])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:1.5,background:v.color}}/>
                <span style={{fontSize:8.5,color:C.textLo,fontFamily:"'Syne Mono',monospace",whiteSpace:"nowrap"}}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          <div style={{flex:1,overflow:"auto",position:"relative"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle,${C.border} 1px,transparent 1px)`,backgroundSize:"26px 26px",opacity:.45,pointerEvents:"none"}}/>
            <svg width={svgW+80} height={svgH+80} style={{display:"block",padding:40,minWidth:"100%"}}>
              {arch.edges.map((e,i)=><SVGEdge key={i} {...e} nodes={arch.nodes}/>)}
              {arch.nodes.map((n,i)=><ArchNode key={n.id} node={n} selected={selNode?.id} onClick={setSelNode} delay={i*.09}/>)}
            </svg>
            {!selNode&&<div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",padding:"7px 16px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,fontSize:9.5,color:C.textLo,fontFamily:"'Syne Mono',monospace",pointerEvents:"none",whiteSpace:"nowrap"}}>● CLICK ANY NODE FOR DETAILS</div>}
          </div>
          {selNode&&<DetailPanel node={selNode} onClose={()=>setSelNode(null)}/>}
        </div>

        {/* Bottom stack strip */}
        <div style={{height:50,display:"flex",alignItems:"center",gap:7,padding:"0 20px",borderTop:`1px solid ${C.border}`,background:C.bgDeep,flexShrink:0,overflowX:"auto"}}>
          <span style={{color:C.textLo,fontSize:9,fontFamily:"'Syne Mono',monospace",flexShrink:0}}>STACK →</span>
          {arch.nodes.map(n=>{
            const cat=CAT[n.category]||CAT.ingestion;
            const isSel=selNode?.id===n.id;
            const logoUrl=TOOL_LOGO_MAP[n.label];
            return (
              <button key={n.id} onClick={()=>setSelNode(n)} style={{background:isSel?`${cat.color}20`:C.surface,border:`1px solid ${isSel?cat.color:C.border}`,borderRadius:6,padding:"5px 11px",cursor:"pointer",display:"flex",alignItems:"center",gap:7,transition:"all .15s",flexShrink:0}}>
                {logoUrl?<img src={logoUrl} style={{width:14,height:14,objectFit:"contain"}} onError={e=>{e.target.style.display="none"}}/>:<span style={{color:cat.color,fontSize:9}}>{cat.glyph}</span>}
                <span style={{color:isSel?C.textHi:C.text,fontSize:10,fontWeight:600,whiteSpace:"nowrap"}}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

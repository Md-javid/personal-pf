export const PORTFOLIO_DATA = {
  name: "Javid",
  title: "AI Engineer & Multi-Agent Systems Specialist",
  location: "Kochi / Coimbatore, India",
  tagline: "AI Engineer specializing in multi-agent orchestration, GraphRAG, LLM evaluations, and enterprise workflow automation — engineering deterministic, production-grade pipelines with Python, LangGraph, MCP, and Next.js.",
  heroStats: [
    { value: "3rd Year", label: "B.Tech IT student" },
    { value: "4+", label: "hackathon finishes" },
    { value: "Kauvery Hospitals", label: "AI & Automation Intern" },
  ],
  capabilities: [
    {
      icon: "network",
      title: "Multi-Agent Orchestration",
      desc: "Designing scalable, deterministic agent graphs with LangGraph and CrewAI — where specialized sub-agents collaborate with state memory, dynamic routing, and human-in-the-loop controls.",
      tags: ["LangGraph", "CrewAI", "ReAct Loops", "MCP Protocol"]
    },
    {
      icon: "database-zap",
      title: "GraphRAG & Hybrid Retrieval",
      desc: "Architecting context-rich retrieval pipelines integrating vector embeddings (FAISS/ChromaDB), knowledge graphs, and hybrid re-ranking to deliver zero-fabrication factual synthesis.",
      tags: ["GraphRAG", "FAISS", "Hybrid Search", "LlamaIndex"]
    },
    {
      icon: "workflow",
      title: "Automated Scraping & Intelligence",
      desc: "Deploying resilient web scraping engines with Playwright and Scrapy alongside n8n automations to extract high-yield competitor data and sync with enterprise APIs.",
      tags: ["Playwright", "Web Scraping", "n8n", "FastAPI"]
    }
  ],
  techStack: [
    {
      category: "AI & LLM Engineering",
      items: [
        { name: "LangGraph", color: "#F0B87E" },
        { name: "CrewAI", color: "#F0B87E" },
        { name: "GraphRAG", color: "#F0B87E" },
        { name: "Model Context Protocol (MCP)", color: "#F0B87E" },
        { name: "RAGAS (LLM Evals)", color: "#F0B87E" },
        { name: "LangSmith & DeepEval", color: "#F0B87E" },
        { name: "LoRA & QLoRA Fine-Tuning", color: "#F0B87E" },
        { name: "Google Gemini 3.7 / 3.6 Flash", color: "#F0B87E" },
        { name: "Claude & Llama", color: "#F0B87E" },
        { name: "DeepSeek R1 / V3", color: "#F0B87E" },
      ]
    },
    {
      category: "Web Scraping & Data Extraction (SEO & Intelligence)",
      items: [
        { name: "Playwright", color: "#9AA3B0" },
        { name: "Beautiful Soup 4", color: "#9AA3B0" },
        { name: "Scrapy", color: "#9AA3B0" },
        { name: "Selenium", color: "#9AA3B0" },
        { name: "Headless Chromium", color: "#9AA3B0" },
        { name: "Pandas & Data Cleaning", color: "#9AA3B0" },
      ]
    },
    {
      category: "Full Stack & Web Frameworks",
      items: [
        { name: "Python 3.11+", color: "#F0B87E" },
        { name: "FastAPI", color: "#F0B87E" },
        { name: "Django 5", color: "#F0B87E" },
        { name: "React 19", color: "#F0B87E" },
        { name: "Next.js 14 / 15", color: "#F0B87E" },
        { name: "TypeScript", color: "#F0B87E" },
        { name: "Node.js / Express", color: "#F0B87E" },
        { name: "Streamlit", color: "#F0B87E" },
      ]
    },
    {
      category: "Databases, Cloud & DevOps",
      items: [
        { name: "PostgreSQL", color: "#9AA3B0" },
        { name: "MongoDB", color: "#9AA3B0" },
        { name: "FAISS & ChromaDB", color: "#9AA3B0" },
        { name: "Supabase", color: "#9AA3B0" },
        { name: "Docker & Compose", color: "#9AA3B0" },
        { name: "AWS (EC2, S3)", color: "#9AA3B0" },
        { name: "Vercel & Git", color: "#9AA3B0" },
        { name: "JWT Auth & REST APIs", color: "#9AA3B0" },
      ]
    },
  ],
  agenticQueries: [
    {
      id: "rag-experience",
      question: "What is Javid's experience with RAG & Vector Search?",
      topic: "GraphRAG & Hybrid Search",
      agentFlow: [
        { node: "Router Node", action: "Parsing query semantics & selecting GraphRAG schema..." },
        { node: "MCP Tool Call", action: "Invoking mcp://javid-resume/vector-db with top_k=5 FAISS chunks..." },
        { node: "Verification Agent", action: "Validating against Kauvery Hospitals & Freelance production RAG records..." },
        { node: "Synthesizer Node", action: "Generating deterministic response with strict Pydantic output formatting..." }
      ],
      response: "Javid has deep hands-on expertise engineering production-grade RAG and GraphRAG pipelines. At Kauvery Hospitals, he built enterprise document Q&A systems using LangChain, FAISS, and the Gemini API with zero-hallucination guardrails. As a freelance AI developer, he deploys hybrid vector search pipelines combining semantic dense embeddings with BM25 keyword matching for high-precision retrieval across complex PDF datasets.",
      evals: {
        faithfulness: "99.4%",
        relevance: "98.9%",
        evalFramework: "RAGAS Verified",
        latency: "118ms",
        traceId: "ls_trace_rag_883"
      }
    },
    {
      id: "multi-agent",
      question: "How does Javid build Multi-Agent systems with LangGraph?",
      topic: "LangGraph & ReAct Loops",
      agentFlow: [
        { node: "Orchestrator Agent", action: "Initializing LangGraph StateGraph topology..." },
        { node: "MCP Tool Call", action: "Inspecting agent nodes: PolicyPulse AI (4 Agents) & BillAgent Pro..." },
        { node: "Guardrail Agent", action: "Enforcing cyclic convergence bounds & Pydantic state constraints..." },
        { node: "Synthesizer Node", action: "Compiling architectural breakdown of LangGraph production deployments..." }
      ],
      response: "Javid architects deterministic multi-agent graphs using LangGraph where each agent possesses isolated memory, specialized system prompts, and strict handoff conditions. In PolicyPulse AI (GDG Delhi Hackfest Winner), he engineered a 4-agent ReAct loop (Security, Privacy, Vendor, Ops) to autonomously remediate compliance breaches. In BillAgent Pro, he built an OCR -> Validation -> Learning sequential pipeline to eliminate human error.",
      evals: {
        faithfulness: "99.8%",
        relevance: "99.2%",
        evalFramework: "DeepEval Passed",
        latency: "142ms",
        traceId: "ls_trace_agent_412"
      }
    },
    {
      id: "scraping-intel",
      question: "Tell me about Javid's Web Scraping & Playwright pipelines",
      topic: "Web Scraping & SEO Intelligence",
      agentFlow: [
        { node: "Router Node", action: "Analyzing automation & data extraction capabilities..." },
        { node: "MCP Tool Call", action: "Querying Playwright, Scrapy, BeautifulSoup, and MarketMind AI records..." },
        { node: "Verification Agent", action: "Checking anti-bot evasion & DOM parsing benchmarks..." },
        { node: "Synthesizer Node", action: "Streaming production scraping and intelligence synthesis..." }
      ],
      response: "Javid engineers resilient, headless web scraping pipelines using Playwright, BeautifulSoup, and Scrapy for automated market intelligence and SEO analytics. In MarketMind AI (SNS GenAI Sprint), his autonomous Scout Agent scraped competitor websites in real time, bypassed bot defenses, parsed live pricing/features, and fed structured data directly into LangGraph analyst nodes and automated WhatsApp alert triggers.",
      evals: {
        faithfulness: "99.1%",
        relevance: "98.5%",
        evalFramework: "RAGAS Verified",
        latency: "105ms",
        traceId: "ls_trace_scrape_209"
      }
    },
    {
      id: "hackathons-wins",
      question: "What are Javid's key production projects & Hackathon wins?",
      topic: "Production Proof & Awards",
      agentFlow: [
        { node: "Orchestrator Agent", action: "Gathering competitive achievements and project repositories..." },
        { node: "MCP Tool Call", action: "Retrieving awards: GDG New Delhi, AI Agentathon, AMD Slingshot, AI4DEV..." },
        { node: "Guardrail Agent", action: "Cross-referencing GitHub commits & verified hackathon standings..." },
        { node: "Synthesizer Node", action: "Delivering verified credential summary..." }
      ],
      response: "Javid is an award-winning builder with 4+ competitive hackathon finishes: Top Project Winner at HACKFEST 2.0 (GDG New Delhi) for PolicyPulse AI, 4th Place at AI Agentathon for BillAgent Pro, AMD Slingshot finalist for Aura-NPU (100% offline edge AI on AMD Ryzen AI NPU in 22 Indian languages), and Medi-Flow India for AI4DEV 2026. He is currently an AI & Automation Intern at Kauvery Hospitals.",
      evals: {
        faithfulness: "100.0%",
        relevance: "99.6%",
        evalFramework: "DeepEval Passed",
        latency: "94ms",
        traceId: "ls_trace_win_771"
      }
    }
  ],
  caseStudies: [
    {
      title: "BillAgent Pro — Multi-Agent Expense Intelligence",
      industry: "FinTech & AI Bill Processing (4th Place AI Agentathon)",
      summary: "AI bill management system leveraging Gemini 3.7 Flash Vision. Features a multi-agent pipeline (OCR -> Validation -> Learning) to extract vendor, line items, totals, and tax with confidence scoring.",
      before: { value: "Manual", label: "data entry & line extraction" },
      after: { value: "~2-3 sec", label: "instant AI OCR & validation" },
      metrics: [
        { value: "Multi-Agent", label: "Validation & Learning loops" },
        { value: "JWT Auth", label: "Isolated user tenant data" }
      ],
      stack: ["React 19", "TypeScript", "Django 5", "Gemini 3.7 Flash", "Recharts"]
    },
    {
      title: "MediCode AI — EHR & Medical Coding Platform",
      industry: "HealthTech & Clinical Automation (ICD-11 / FHIR R4)",
      summary: "AI medical coding platform automating ICD-11, CPT, and SNOMED CT code generation from clinical notes. Validates HL7 FHIR R4 compliance, generates SOAP summaries.",
      before: { value: "Manual", label: "clinical coding & audit" },
      after: { value: "Instant", label: "ICD-11 & CPT extraction" },
      metrics: [
        { value: "HL7 FHIR", label: "R4 compliant validation" },
        { value: "Dockerized", label: "Full-stack container setup" }
      ],
      stack: ["React 19", "Django 5", "Gemini 3.7 Flash", "Docker", "HL7 FHIR"]
    },
    {
      title: "PolicyPulse AI — Autonomous Compliance Platform",
      industry: "GovTech & RegTech (GDG Delhi HACKFEST 2.0 Winner)",
      summary: "Autonomous policy compliance platform. Ingests GDPR/SOC 2 policy PDFs, scans databases, and runs a ReAct Agent loop alongside 4 specialist agents.",
      before: { value: "Months", label: "undetected policy breaches" },
      after: { value: "Autonomous", label: "real-time scanning & fix" },
      metrics: [
        { value: "GDG Delhi", label: "HACKFEST Top Project Winner" },
        { value: "ReAct Loop", label: "4 Specialist AI Agents" }
      ],
      stack: ["FastAPI", "React 19", "MongoDB", "Gemini 3.6 Flash", "Docker"]
    },
    {
      title: "Aura-NPU — Offline Neuro-Inclusive Assistant",
      industry: "Accessibility & Edge AI (AMD Slingshot 2026 Hackathon)",
      summary: "Multimodal AI assistant running 100% offline on the AMD Ryzen AI 300 Series XDNA 2 NPU (~100ms latency). Supports 22 Indian languages.",
      before: { value: "Cloud Only", label: "English-only AI dependency" },
      after: { value: "~100 ms", label: "100% local NPU edge inference" },
      metrics: [
        { value: "22 Languages", label: "Full Indian language set" },
        { value: "Zero Cloud", label: "100% offline privacy safe" }
      ],
      stack: ["Python 3.11", "NiceGUI", "AMD Ryzen AI NPU", "VitisAI ONNX", "Ollama"]
    },
    {
      title: "Medi-Flow India — National Blood Supply Network",
      industry: "Healthcare Logistics (AI4DEV 2026 Hackathon)",
      summary: "Client-side national blood supply coordination network across 12 Indian cities. Uses a 4-step AI Agent pipeline to monitor shortages and route ambulances.",
      before: { value: "Critical", label: "uncoordinated blood shortages" },
      after: { value: "Real-time", label: "AI stock watch & smart routing" },
      metrics: [
        { value: "46 Hospitals", label: "Across 12 major Indian cities" },
        { value: "4 AI Agents", label: "Autonomous supply routing" }
      ],
      stack: ["Vanilla JS", "HTML5", "CSS3", "Leaflet.js", "Haversine Distance"]
    },
    {
      title: "MarketMind AI — Multi-Agent Market Intelligence",
      industry: "Competitive Intelligence (SNS GenAI Sprint)",
      summary: "Multi-agent platform for small businesses. Runs a 4-agent LangGraph StateGraph pipeline to scrape competitor sites, perform SWOT, and dispatch WhatsApp alerts.",
      before: { value: "Manual", label: "competitor & market tracking" },
      after: { value: "1-Click", label: "full strategy & 24hr social plan" },
      metrics: [
        { value: "LangGraph", label: "4-agent sequential workflow" },
        { value: "WhatsApp", label: "Automated alert dispatches" }
      ],
      stack: ["Next.js 14", "FastAPI", "LangGraph 0.2", "Groq Llama 3.3", "Twilio"]
    }
  ],
  terminalPresets: [
    {
      label: "Trigger n8n Webhook Demo",
      icon: "webhook",
      lines: [
        "$ curl -X POST https://n8n.internal/webhook/content-planner",
        "→ payload received: { source: 'sheet_row_42' }",
        "→ AI Agent node: drafting content package...",
        "→ HTML formatter: packaging output...",
        "→ Gmail node: sending daily digest...",
      ],
      result: "✓ Workflow completed in 1.8s — 4/4 nodes succeeded"
    },
    {
      label: "Simulate a LangGraph Loop",
      icon: "repeat",
      lines: [
        "$ python run_graph.py --agent reasoner",
        "→ state: { step: 1, task: 'verify_claim' }",
        "→ reasoner_agent: evidence insufficient, looping back",
        "→ extractor_agent: fetching additional sources...",
        "→ reasoner_agent: evidence sufficient, exiting loop",
      ],
      result: "✓ Graph converged after 2 iterations"
    },
    {
      label: "Run a RAG Query",
      icon: "search",
      lines: [
        "$ python query.py \"latest clinical CME guidelines\"",
        "→ embedding query...",
        "→ vector_db: top_k=5 chunks retrieved (FAISS index)",
        "→ llm_reasoner: synthesizing grounded answer...",
      ],
      result: "✓ Answer generated with 5 cited sources"
    }
  ],
  marqueeTools: [
    { name: "LangGraph", icon: "git-merge" },
    { name: "Unsloth / PEFT", icon: "zap" },
    { name: "vLLM / Ollama", icon: "terminal" },
    { name: "CrewAI", icon: "bot" },
    { name: "Model Context Protocol (MCP)", icon: "workflow" },
    { name: "pgvector / Qdrant", icon: "database" },
    { name: "GraphRAG", icon: "database" },
    { name: "Pydantic / Instructor", icon: "shield-check" },
    { name: "Docker / AWS Bedrock", icon: "cloud" },
    { name: "RAGAS & LangSmith", icon: "gauge" },
    { name: "Playwright (Scraping)", icon: "play-circle" },
    { name: "FastAPI", icon: "server" },
    { name: "Python", icon: "code" },
    { name: "React 19 & Next.js", icon: "layout" }
  ],
  socials: [
    { name: "LinkedIn", href: "https://linkedin.com/in/javidsiast", handle: "in/javidsiast" },
    { name: "GitHub", href: "https://github.com/Md-javid", handle: "github.com/Md-javid" },
    { name: "Email", href: "mailto:connectjavid27@gmail.com", handle: "connectjavid27@gmail.com" }
  ],
  badges: [
    "3rd Year B.Tech IT — SNS College of Technology (CGPA 8.47)",
    "AI & Automation Intern — Kauvery Hospitals",
    "Multi-Agent Architect (LangGraph / CrewAI)",
    "Open Source Contributor & Hackathon Winner"
  ],
  aboutParagraphs: [
    "I'm currently a 3rd-year B.Tech Information Technology student at SNS College of Technology (CGPA 8.47), working as an AI & Automation Engineering Intern at Kauvery Hospitals — building AI-driven automation pipelines, competitive intelligence systems, and digital strategy tooling for hospital leadership.",
    "My focus is using LLMs for deterministic reasoning and orchestration rather than content generation: multi-agent systems with LangGraph, GraphRAG retrieval with FAISS/ChromaDB, Model Context Protocol (MCP) integrations, and LLM evaluations with RAGAS and LangSmith.",
    "I also engineer robust web scraping and headless browser pipelines (Playwright, Scrapy, BeautifulSoup) to extract high-signal structured intelligence from across the open web.",
    "Outside of engineering, I care about photography, video editing, and visual design — which translates into how I build software: deliberate, mathematically grounded, and free of clutter."
  ]
};

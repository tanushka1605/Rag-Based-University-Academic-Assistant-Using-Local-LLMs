import { useState } from "react"
import { useNav } from "../App"

const NAV_LINKS = [
  { label: "Features", href: "features" },
  { label: "How It Works", href: "how-it-works" },
  { label: "Dashboards", href: "dashboards" },
  { label: "Stack", href: "stack" },
  { label: "Privacy", href: "privacy" },
  { label: "Contact", href: "contact" },
]

const FEATURES = [
  {
    icon: "🔒",
    tag: "Privacy-First",
    title: "100% On-Premise Inference",
    body: "No query or document ever leaves your campus network. Local LLMs via Ollama ensure student records remain yours.",
  },
  {
    icon: "📚",
    tag: "RAG Pipeline",
    title: "Grounded, Cited Answers",
    body: "Every response is anchored to retrieved source chunks — syllabi, circulars, question banks — with inline citations.",
  },
  {
    icon: "🎓",
    tag: "Role-Based",
    title: "Three Tailored Dashboards",
    body: "Students, teachers, and admins each get a purpose-built view with scoped data access enforced at the retrieval layer.",
  },
  {
    icon: "⚡",
    tag: "Performance",
    title: "Sub-5s Response Target",
    body: "Hybrid keyword + semantic retrieval with optional re-ranking delivers accurate context before the user notices.",
  },
  {
    icon: "🌐",
    tag: "Multilingual",
    title: "Regional Language Q&A",
    body: "Students query in their preferred language. The assistant answers in kind — critical for diverse university campuses.",
  },
  {
    icon: "📊",
    tag: "Analytics",
    title: "Cross-Role Insights",
    body: "Attendance heatmaps, semester performance trends, faculty workload — all in one unified admin view.",
  },
]

const STEPS = [
  {
    num: "01",
    title: "Ingest Documents",
    body: "Upload syllabi, timetables, circulars, exam schedules, and faculty profiles. LangChain loaders handle PDF, DOCX, PPT, and CSV.",
  },
  {
    num: "02",
    title: "Chunk & Embed",
    body: "Semantic chunking with metadata tagging (subject, semester, department). Embeddings stored in a local ChromaDB / FAISS instance.",
  },
  {
    num: "03",
    title: "Retrieve",
    body: "Hybrid retrieval — keyword BM25 + dense vector search — surfaces the most relevant chunks for any natural-language query.",
  },
  {
    num: "04",
    title: "Generate",
    body: "A locally hosted LLM (Llama 3.1, Mistral 7B, or Phi-3 via Ollama) synthesizes a grounded answer from retrieved context.",
  },
]

const DASHBOARDS = [
  {
    role: "Student",
    color: "#f5a623",
    items: [
      "Attendance % & CGPA tracker",
      "Upcoming exam & assignment calendar",
      "Subject-wise doubt-solving assistant",
      "AI-summarized notice board",
      "Performance trend charts",
      "Study planner from weak areas",
    ],
    img: "https://images.unsplash.com/photo-1633987027569-a6599b632de7?w=600&h=400&fit=crop&auto=format",
    imgAlt: "Students studying on campus",
  },
  {
    role: "Professor",
    color: "#38bdf8",
    items: [
      "Auto-generate quizzes from course notes",
      "Attendance & grade management panel",
      "Class-wise weak-topic analytics",
      "Upload documents to RAG knowledge base",
      "AI-assisted student feedback drafting",
      "Assignment scheduling + notice generation",
    ],
    img: "https://images.unsplash.com/photo-1642552187855-388a77930fa8?w=600&h=400&fit=crop&auto=format",
    imgAlt: "Modern university building",
  },
  {
    role: "Admin",
    color: "#a78bfa",
    items: [
      "Unified analytics across departments",
      "Knowledge-base document management",
      "User & role permission management",
      "LLM health & retrieval accuracy logs",
      "Institution-wide broadcast + AI summaries",
      "Audit log with privacy safeguards",
    ],
    img: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=600&h=400&fit=crop&auto=format",
    imgAlt: "Abstract AI network visualization",
  },
]

const STACK = [
  { layer: "Local LLM", tools: "Ollama · Llama 3.1 · Mistral 7B · Phi-3" },
  {
    layer: "Embeddings",
    tools: "nomic-embed-text · bge-small-en · all-MiniLM-L6-v2",
  },
  { layer: "Vector Store", tools: "ChromaDB · FAISS · Qdrant (local)" },
  { layer: "Orchestration", tools: "LangChain · LlamaIndex" },
  { layer: "Backend", tools: "FastAPI · Python · PostgreSQL / SQLite" },
  { layer: "Frontend", tools: "React · Next.js · Tailwind CSS" },
  { layer: "Auth", tools: "JWT · Role-based access control" },
  {
    layer: "Deployment",
    tools: "Docker Compose · fully offline / campus-local",
  },
]

const PRIVACY_POINTS = [
  {
    heading: "Data never leaves campus",
    body: "All inference runs on your hardware. No cloud API key, no external call, no data residency risk.",
  },
  {
    heading: "Role-scoped retrieval",
    body: "A student cannot query another student's grades — enforced at the vector retrieval layer, not just the UI.",
  },
  {
    heading: "Encrypted at rest",
    body: "Student records and embeddings are stored with AES-256 encryption. Keys stay on your infrastructure.",
  },
  {
    heading: "Full audit trail",
    body: "Every chatbot query is logged with timestamps and role metadata for academic integrity review — with configurable PII masking.",
  },
]

type DashTab = "Student" | "Professor" | "Admin"

export default function Landing() {
  const { navigate } = useNav()
  const [activeTab, setActiveTab] = useState<DashTab>("Student")
  const [menuOpen, setMenuOpen] = useState(false)
  const [demoEmail, setDemoEmail] = useState("")
  const [demoSubmitted, setDemoSubmitted] = useState(false)

  const activeDash = DASHBOARDS.find((d) => d.role === activeTab)!

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (demoEmail) setDemoSubmitted(true)
  }

  return (
    <div className="min-h-full bg-[#0b1120] text-[#f0f4ff]">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/8 bg-[#0b1120]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-3"
          >
            <span
              className="w-8 h-8 rounded bg-[#f5a623] flex items-center justify-center text-[#0b1120] font-bold text-sm select-none"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Ac
            </span>
            <span
              className="font-semibold text-lg tracking-tight"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              AcademiQ
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-7 text-sm text-[#8ba3c7]">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => scrollTo(l.href)}
                  className="hover:text-[#f0f4ff] transition-colors"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("signin")}
              className="text-sm text-[#8ba3c7] hover:text-[#f0f4ff] transition-colors px-4 py-2"
            >
              Sign in
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="text-sm bg-[#f5a623] text-[#0b1120] font-semibold px-4 py-2 rounded hover:bg-[#fbbf55] transition-colors"
            >
              Request Demo
            </button>
          </div>

          <button
            className="md:hidden text-[#8ba3c7]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <path
                  d="M4 4l14 14M18 4L4 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <line
                    x1="3"
                    y1="6"
                    x2="19"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="11"
                    x2="19"
                    y2="11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="16"
                    x2="19"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-white/8 bg-[#0b1120] px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href)}
                className="text-sm text-[#8ba3c7] hover:text-[#f0f4ff] text-left"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => navigate("signin")}
              className="text-sm text-[#8ba3c7] hover:text-[#f0f4ff] text-left"
            >
              Sign in
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="mt-2 text-sm bg-[#f5a623] text-[#0b1120] font-semibold px-4 py-2 rounded w-full"
            >
              Request Demo
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative pt-36 pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[#f5a623]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_420px] gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#f5a623]/30 bg-[#f5a623]/8 text-[#f5a623] text-xs font-mono tracking-widest uppercase px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-pulse" />
              Fully Local · Privacy-Preserving · Open Weights
            </div>
            <h1
              className="text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Your university knowledge,
              <br />
              <em className="not-italic text-[#f5a623]">
                answered intelligently.
              </em>
            </h1>
            <p className="text-[#8ba3c7] text-lg leading-relaxed max-w-xl mb-10">
              AcademiQ is a RAG-powered academic assistant running entirely on
              your campus servers — no cloud, no API keys. Students, teachers,
              and admins get conversational access to every document that shapes
              academic life.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("signin")}
                className="bg-[#f5a623] text-[#0b1120] font-semibold px-6 py-3 rounded hover:bg-[#fbbf55] transition-colors text-sm"
              >
                Get Started →
              </button>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="border border-white/15 text-[#f0f4ff] font-medium px-6 py-3 rounded hover:bg-white/5 transition-colors text-sm"
              >
                View Architecture
              </button>
            </div>
            <div className="mt-12 flex flex-wrap gap-8 text-sm text-[#8ba3c7]">
              {[
                ["3", "Role-Based Dashboards"],
                ["<5s", "Median Response Time"],
                ["100%", "On-Campus Inference"],
              ].map(([val, label]) => (
                <div key={label}>
                  <div
                    className="text-2xl text-[#f0f4ff] font-semibold"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    {val}
                  </div>
                  <div className="text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat preview */}
          <div className="hidden lg:block">
            <div className="bg-[#131e33] border border-white/8 rounded-xl overflow-hidden shadow-2xl">
              <div className="px-4 py-3 border-b border-white/8 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-[#4d6b8a] font-mono">
                  AcademiQ · Student Assistant
                </span>
              </div>
              <div className="p-5 space-y-4">
                <ChatBubble
                  role="user"
                  text="When is my next Data Structures exam?"
                />
                <ChatBubble
                  role="assistant"
                  text="Your DS mid-semester exam is 14 Nov 2025 at 10:00 AM in Hall B-204. Focus on AVL Trees, Graph Traversals, and Dynamic Programming — DP appears in 70% of past papers."
                  source="Source: DS Syllabus v2.pdf · ExamSchedule_Sem5.xlsx"
                />
                <ChatBubble
                  role="user"
                  text="What is the attendance policy for backlog students?"
                />
                <ChatBubble
                  role="assistant"
                  text="Backlog students need 75% attendance per subject for supplementary exams, per Section 4.2 of Academic Policy 2024–25. Medical exemptions require a certificate within 7 days."
                  source="Source: AcademicPolicy_2024-25.pdf § 4.2"
                />
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => navigate("signin")}
                  className="w-full bg-[#0b1120] border border-white/10 rounded-lg px-4 py-2.5 flex items-center gap-3 hover:border-[#f5a623]/40 transition-colors group"
                >
                  <span className="text-sm text-[#4d6b8a] flex-1 text-left group-hover:text-[#8ba3c7] transition-colors">
                    Sign in to start asking…
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-[#f5a623]"
                  >
                    <path
                      d="M14 8H2M9 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel>Platform Capabilities</SectionLabel>
          <h2
            className="text-4xl font-semibold mt-3 mb-4"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Built for how universities actually work
          </h2>
          <p className="text-[#8ba3c7] max-w-xl mb-14">
            Not a generic chatbot wrapper. AcademiQ is engineered around the
            document types, access hierarchies, and compliance requirements of
            academic institutions.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-[#0b1120] p-8 hover:bg-[#131e33] transition-colors group cursor-default"
              >
                <div className="text-2xl mb-4">{f.icon}</div>
                <div className="text-[10px] font-mono tracking-widest text-[#f5a623] uppercase mb-2">
                  {f.tag}
                </div>
                <h3
                  className="text-lg font-semibold mb-3 group-hover:text-[#f5a623] transition-colors"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-[#8ba3c7] text-sm leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-[#0d1628]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel>RAG Pipeline</SectionLabel>
          <h2
            className="text-4xl font-semibold mt-3 mb-16"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            How every answer is grounded
          </h2>
          <div className="grid md:grid-cols-4 gap-px bg-white/8">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative bg-[#0d1628] p-8">
                <div className="font-mono text-5xl font-bold text-white/5 mb-4 select-none">
                  {s.num}
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-[4.5rem] right-0 translate-x-1/2 z-10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 3l5 5-5 5"
                        stroke="#f5a623"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-[#8ba3c7] text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-[#131e33] border border-white/8 rounded-xl p-8 grid md:grid-cols-3 gap-8">
            {[
              ["Chunking", "Semantic + recursive with metadata tagging"],
              ["Retrieval", "Hybrid BM25 + dense vector, optional re-ranking"],
              [
                "Guardrails",
                "If context is absent, the assistant says so — no hallucination",
              ],
            ].map(([label, val]) => (
              <div key={label}>
                <div className="text-[10px] font-mono tracking-widest text-[#4d6b8a] uppercase mb-2">
                  {label}
                </div>
                <div className="text-sm text-[#8ba3c7]">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARDS */}
      <section id="dashboards" className="py-24 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel>Role Dashboards</SectionLabel>
          <h2
            className="text-4xl font-semibold mt-3 mb-10"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            The right view for every stakeholder
          </h2>
          <div className="flex gap-1 mb-10 border border-white/8 rounded-lg p-1 w-fit">
            {(["Student", "Professor", "Admin"] as DashTab[]).map((role) => (
              <button
                key={role}
                onClick={() => setActiveTab(role)}
                className={`px-5 py-2 rounded text-sm font-medium transition-all ${
                  activeTab === role
                    ? "bg-[#1a2843] text-[#f0f4ff]"
                    : "text-[#8ba3c7] hover:text-[#f0f4ff]"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <div
                className="text-xs font-mono tracking-widest uppercase mb-4"
                style={{ color: activeDash.color }}
              >
                {activeDash.role} Dashboard
              </div>
              <ul className="space-y-3 mb-8">
                {activeDash.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-[#8ba3c7]"
                  >
                    <span
                      className="mt-1 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center"
                      style={{ background: activeDash.color + "22" }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1.5 4l2 2 3-3"
                          stroke={activeDash.color}
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("signin")}
                className="text-sm font-semibold px-5 py-2.5 rounded border transition-colors"
                style={{
                  borderColor: activeDash.color + "60",
                  color: activeDash.color,
                }}
              >
                Open {activeDash.role} Dashboard →
              </button>
            </div>
            <div
              className="relative rounded-xl overflow-hidden bg-[#131e33]"
              style={{ aspectRatio: "3/2" }}
            >
              <img
                src={activeDash.img}
                alt={activeDash.imgAlt}
                className="w-full h-full object-cover opacity-60"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${activeDash.color}22 0%, transparent 60%)`,
                }}
              />
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#0b1120]/90 to-transparent">
                <div className="text-xs font-mono text-[#8ba3c7]">
                  {activeDash.imgAlt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section
        id="stack"
        className="py-24 bg-[#0d1628] border-t border-white/8"
      >
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel>Technology Stack</SectionLabel>
          <h2
            className="text-4xl font-semibold mt-3 mb-14"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Open, modular, and swappable
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-white/8">
            {STACK.map((s) => (
              <div
                key={s.layer}
                className="bg-[#0d1628] px-8 py-5 flex items-baseline gap-6 hover:bg-[#131e33] transition-colors group"
              >
                <div className="w-28 flex-shrink-0 text-[10px] font-mono tracking-widest text-[#4d6b8a] uppercase group-hover:text-[#f5a623] transition-colors">
                  {s.layer}
                </div>
                <div className="text-sm text-[#8ba3c7] font-mono">
                  {s.tools}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-[#4d6b8a] font-mono">
            Deployment via Docker Compose — fully offline, campus-local. Swap
            the LLM or vector store without touching the pipeline.
          </p>
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="py-24 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionLabel>Privacy & Security</SectionLabel>
            <h2
              className="text-4xl font-semibold mt-3 mb-6"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Student data is not a product.
            </h2>
            <p className="text-[#8ba3c7] leading-relaxed mb-10">
              AcademiQ was designed from the ground up for institutions that
              cannot compromise on data sovereignty. The architecture is
              air-gappable — inference, retrieval, and storage all run on your
              hardware, under your policies.
            </p>
            <div className="space-y-6">
              {PRIVACY_POINTS.map((p) => (
                <div key={p.heading} className="flex gap-4">
                  <div className="w-6 h-6 mt-0.5 rounded bg-[#f5a623]/15 flex-shrink-0 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2.5 2.5 3.5-4"
                        stroke="#f5a623"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-1">
                      {p.heading}
                    </div>
                    <div className="text-sm text-[#8ba3c7]">{p.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="relative rounded-2xl overflow-hidden bg-[#131e33]"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&h=520&fit=crop&auto=format"
              alt="AI circuit board"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5a623]/10 to-[#0b1120]/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
              <div
                className="text-6xl font-bold text-[#f5a623]"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                0
              </div>
              <div className="text-sm text-[#8ba3c7] max-w-xs">
                external API calls made by any deployed instance of AcademiQ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section
        id="contact"
        className="py-24 border-t border-white/8 bg-[#0d1628]"
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionLabel centered>Get Started</SectionLabel>
          <h2
            className="text-4xl font-semibold mt-3 mb-5"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Ready to deploy AcademiQ at your institution?
          </h2>
          <p className="text-[#8ba3c7] mb-10">
            Our team will walk you through a fully local deployment on your
            existing GPU/CPU infrastructure. No SaaS contract, no ongoing API
            cost, no data leaving your campus.
          </p>
          {!demoSubmitted ? (
            <form
              onSubmit={handleDemoSubmit}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input
                type="email"
                placeholder="your@university.edu"
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                required
                className="flex-1 max-w-sm bg-[#131e33] border border-white/10 rounded px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4d6b8a] focus:outline-none focus:border-[#f5a623]/50 transition-colors"
              />
              <button
                type="submit"
                className="bg-[#f5a623] text-[#0b1120] font-semibold px-6 py-3 rounded hover:bg-[#fbbf55] transition-colors text-sm whitespace-nowrap"
              >
                Request Demo
              </button>
            </form>
          ) : (
            <div className="bg-[#131e33] border border-[#f5a623]/30 rounded-xl p-6 max-w-sm mx-auto">
              <div className="text-[#f5a623] text-2xl mb-2">✓</div>
              <div className="font-semibold mb-1">Request received!</div>
              <div className="text-sm text-[#8ba3c7]">
                We'll reach out to {demoEmail} within 24 hours.
              </div>
            </div>
          )}
          <p className="mt-6 text-xs text-[#4d6b8a]">
            Or explore the platform now —{" "}
            <button
              onClick={() => navigate("signin")}
              className="text-[#8ba3c7] font-mono underline underline-offset-2 hover:text-[#f5a623] transition-colors"
            >
              sign in with a demo account
            </button>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4d6b8a]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#f5a623] flex items-center justify-center text-[#0b1120] font-bold text-[9px]">
              Ac
            </span>
            <span
              className="text-sm text-[#8ba3c7]"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              AcademiQ
            </span>
          </div>
          <div>
            RAG-Based Academic Assistant · Fully local · Privacy-preserving
          </div>
          <div className="flex gap-5">
            {["GitHub", "Docs", "License"].map((l) => (
              <a
                key={l}
                href="#"
                className="hover:text-[#8ba3c7] transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function SectionLabel({
  children,
  centered,
}: {
  children: React.ReactNode
  centered?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 ${centered ? "justify-center" : ""}`}
    >
      <span className="w-4 h-px bg-[#f5a623]" />
      <span className="text-[10px] font-mono tracking-widest text-[#f5a623] uppercase">
        {children}
      </span>
    </div>
  )
}

function ChatBubble({
  role,
  text,
  source,
}: {
  role: "user" | "assistant"
  text: string
  source?: string
}) {
  return (
    <div
      className={`flex gap-2.5 ${role === "user" ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5 ${
          role === "user"
            ? "bg-[#f5a623]/20 text-[#f5a623]"
            : "bg-[#1a2843] text-[#8ba3c7]"
        }`}
      >
        {role === "user" ? "You" : "AI"}
      </div>
      <div
        className={`max-w-[85%] flex flex-col gap-1 ${
          role === "user" ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`text-xs leading-relaxed px-3.5 py-2.5 rounded-xl ${
            role === "user"
              ? "bg-[#f5a623]/15 text-[#f0f4ff]"
              : "bg-[#1a2843] text-[#c8d8ef]"
          }`}
        >
          {text}
        </div>
        {source && (
          <div className="text-[9px] font-mono text-[#4d6b8a] px-1">
            {source}
          </div>
        )}
      </div>
    </div>
  )
}

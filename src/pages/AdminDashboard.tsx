import { useState, useRef, useEffect } from "react"
import { useNav } from "../App"

const DEPT_STATS = [
  {
    dept: "Computer Science",
    students: 480,
    faculty: 18,
    avgAttendance: 79,
    avgCGPA: 8.2,
  },
  {
    dept: "Electronics",
    students: 420,
    faculty: 15,
    avgAttendance: 74,
    avgCGPA: 7.9,
  },
  {
    dept: "Mechanical",
    students: 390,
    faculty: 16,
    avgAttendance: 82,
    avgCGPA: 7.6,
  },
  {
    dept: "Civil",
    students: 310,
    faculty: 12,
    avgAttendance: 77,
    avgCGPA: 7.4,
  },
]

const USERS = [
  {
    name: "Arjun Sharma",
    email: "arjun.s@university.edu",
    role: "student",
    dept: "CSE",
    status: "active",
  },
  {
    name: "Dr. Priya Mehta",
    email: "p.mehta@university.edu",
    role: "professor",
    dept: "CSE",
    status: "active",
  },
  {
    name: "Sneha Patel",
    email: "sneha.p@university.edu",
    role: "student",
    dept: "CSE",
    status: "active",
  },
  {
    name: "Prof. Anand Rao",
    email: "a.rao@university.edu",
    role: "professor",
    dept: "ECE",
    status: "active",
  },
  {
    name: "Kiran Reddy",
    email: "kiran.r@university.edu",
    role: "student",
    dept: "MECH",
    status: "inactive",
  },
]

const DOCUMENTS = [
  {
    name: "Academic Policy 2024-25.pdf",
    type: "Policy",
    dept: "All",
    size: "2.4 MB",
    updated: "15 Oct 2025",
    indexed: true,
  },
  {
    name: "DS Syllabus Sem5.pdf",
    type: "Syllabus",
    dept: "CSE",
    size: "1.1 MB",
    updated: "2 Aug 2025",
    indexed: true,
  },
  {
    name: "ExamSchedule_Nov2025.xlsx",
    type: "Schedule",
    dept: "All",
    size: "340 KB",
    updated: "1 Nov 2025",
    indexed: true,
  },
  {
    name: "AttendancePolicy_2024.pdf",
    type: "Policy",
    dept: "All",
    size: "890 KB",
    updated: "10 Sep 2025",
    indexed: false,
  },
  {
    name: "Faculty_Profiles_CSE.docx",
    type: "Profile",
    dept: "CSE",
    size: "1.8 MB",
    updated: "20 Jul 2025",
    indexed: true,
  },
]

const AUDIT_LOG = [
  {
    user: "arjun.s@university.edu",
    role: "student",
    query: "When is my Data Structures exam?",
    time: "5 Nov 09:34",
    result: "answered",
  },
  {
    user: "sneha.p@university.edu",
    role: "student",
    query: "What is the minimum attendance?",
    time: "5 Nov 09:12",
    result: "answered",
  },
  {
    user: "p.mehta@university.edu",
    role: "professor",
    query: "Generate quiz on AVL trees for CS301",
    time: "5 Nov 08:55",
    result: "answered",
  },
  {
    user: "kiran.r@university.edu",
    role: "student",
    query: "Show me other students' grades",
    time: "5 Nov 08:40",
    result: "blocked",
  },
  {
    user: "a.rao@university.edu",
    role: "professor",
    query: "ECE batch attendance trends",
    time: "4 Nov 17:22",
    result: "answered",
  },
]

const SYSTEM = [
  {
    label: "LLM (Llama 3.1 8B)",
    status: "online",
    latency: "3.2s avg",
    load: 42,
  },
  {
    label: "Vector DB (ChromaDB)",
    status: "online",
    latency: "120ms",
    load: 28,
  },
  { label: "Embedding Model", status: "online", latency: "0.8s", load: 15 },
  { label: "Document Indexer", status: "indexing", latency: "—", load: 78 },
]

const AI_RESPONSES: Record<string, string> = {
  default:
    "I have full visibility into system health, enrollment data, and the RAG knowledge base. What would you like to know?",
  enrollment:
    "Enrollment Summary — Sem 5 2025-26:\n• Total students: 1,600 across 4 departments\n• New admissions this year: 412 (CSE: 142, ECE: 121, MECH: 98, Civil: 51)\n• Dropout rate: 2.1% (down from 2.8% last year)\n• International students: 34 (2.1% of total)\n\n📎 Source: Enrollment_Sem5_2025.xlsx",
  performance:
    "Cross-department Performance:\n• CSE leads with avg CGPA 8.2, Mechanical at 7.6\n• ECE attendance risk: 18% of students below 75%\n• Top performing batch: CSE-A (avg score 83/100)\n• Recommended: Intervention for ECE attendance drop\n\n📎 Source: DeptReports_Sem5_2025.pdf",
  system:
    "System Health Report (5 Nov 2025 09:41):\n• LLM uptime: 99.2% (7 days)\n• Avg response latency: 3.2s (target: <5s) ✓\n• Daily query volume: 847 queries\n• Retrieval accuracy (sampled): 91.3%\n• Failed queries (hallucination blocked): 23 today\n• Vector DB: 42,891 chunks indexed\n\n📎 Source: SystemMonitor_Dashboard",
  notice:
    "Draft institution-wide notice:\n\n—\nTo: All Students, Faculty & Staff\nSubject: Mid-Semester Examination Reminder\n\nThe mid-semester examinations for Semester 5 (2025-26) will be conducted from 14th to 30th November 2025. All students are required to carry their hall tickets. Attendance during the exam period is mandatory. For queries, contact the Examination Cell at examcell@university.edu.\n\n— Administration\n—\n\n📎 AI-generated draft. Review before broadcasting.",
}

function getAdminAIResponse(query: string): string {
  const q = query.toLowerCase()
  if (
    q.includes("enrollment") ||
    q.includes("admission") ||
    q.includes("student count")
  )
    return AI_RESPONSES.enrollment
  if (
    q.includes("performance") ||
    q.includes("cgpa") ||
    q.includes("dept") ||
    q.includes("department")
  )
    return AI_RESPONSES.performance
  if (
    q.includes("system") ||
    q.includes("health") ||
    q.includes("latency") ||
    q.includes("llm") ||
    q.includes("query volume")
  )
    return AI_RESPONSES.system
  if (
    q.includes("notice") ||
    q.includes("broadcast") ||
    q.includes("announcement") ||
    q.includes("draft")
  )
    return AI_RESPONSES.notice
  return AI_RESPONSES.default
}

type Tab = "overview" | "analytics" | "documents" | "users" | "chat" | "audit" | "system"

export default function AdminDashboard() {
  const { currentUser, logout } = useNav()
  const [tab, setTab] = useState<Tab>("overview")
  const [documents, setDocuments] = useState(DOCUMENTS)
  const [users, setUsers] = useState(USERS)
  const [notice, setNotice] = useState("")
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<{
    role: "user" | "ai"
    text: string
  }[]>([
    {
      role: "ai",
      text: "Hello Rajesh! As admin, I have full visibility across all departments, the RAG knowledge base, and system health. What would you like to know?",
    },
  ])
  const [aiTyping, setAiTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userFilter, setUserFilter] = useState("all")
  const chatEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, aiTyping])

  const sendMessage = (text?: string) => {
    const msg = (text || chatInput).trim()
    if (!msg || aiTyping) return
    setChatInput("")
    setMessages((m) => [...m, { role: "user", text: msg }])
    setAiTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: getAdminAIResponse(msg) }])
      setAiTyping(false)
    }, 1200)
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "documents", label: "Documents", icon: "📁" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "chat", label: "AI Assistant", icon: "✦" },
    { id: "audit", label: "Audit Log", icon: "🔍" },
    { id: "system", label: "System", icon: "⚙️" },
  ]

  const filteredUsers =
    userFilter === "all" ? users : users.filter((u) => u.role === userFilter)

  const uploadDocument = (file: File) => {
    const extension = file.name.split(".").pop()?.toUpperCase() || "FILE"
    setDocuments((current) => [
      {
        name: file.name,
        type: extension,
        dept: "All",
        size: `${Math.max(file.size / 1024 / 1024, 0.01).toFixed(2)} MB`,
        updated: "Today",
        indexed: false,
      },
      ...current,
    ])
    setNotice(`${file.name} was added to the indexing queue.`)
  }

  const editDocument = (name: string) => {
    const nextName = window.prompt("Update the document name", name)?.trim()
    if (!nextName || nextName === name) return
    setDocuments((current) =>
      current.map((document) =>
        document.name === name ? { ...document, name: nextName } : document,
      ),
    )
    setNotice("Document details updated.")
  }

  const removeDocument = (name: string) => {
    if (!window.confirm(`Remove ${name} from the knowledge base?`)) return
    setDocuments((current) =>
      current.filter((document) => document.name !== name),
    )
    setNotice(`${name} was removed.`)
  }

  const addUser = () => {
    const name = window.prompt("New user's full name")?.trim()
    if (!name) return
    const email = window.prompt("University email")?.trim()
    if (!email) return
    const requestedRole = window.prompt("Role: student or professor", "student")
    const role = requestedRole === "professor" ? "professor" : "student"
    const dept = window.prompt("Department code", "CSE")?.trim() || "CSE"
    setUsers((current) => [
      ...current,
      { name, email, role, dept, status: "active" },
    ])
    setNotice(`${name} was added as a ${role}.`)
  }

  const toggleUserStatus = (email: string) => {
    setUsers((current) =>
      current.map((user) =>
        user.email === email
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user,
      ),
    )
    const user = users.find((item) => item.email === email)
    setNotice(
      `${user?.name ?? "User"} is now ${
        user?.status === "active" ? "inactive" : "active"
      }.`,
    )
  }

  return (
    <div className="min-h-full bg-[#0b1120] text-[#f0f4ff] flex flex-col">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0b1120]/95 backdrop-blur-sm px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-[#8ba3c7] hover:text-white mr-1"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line
                x1="2"
                y1="5"
                x2="18"
                y2="5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                x1="2"
                y1="10"
                x2="18"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                x1="2"
                y1="15"
                x2="18"
                y2="15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span
            className="w-6 h-6 rounded bg-[#a78bfa] flex items-center justify-center text-[#0b1120] font-bold text-[10px]"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Ac
          </span>
          <span
            className="font-semibold text-sm"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            AcademiQ
          </span>
          <span className="hidden md:block text-[#4d6b8a] text-sm">
            / Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-[#8ba3c7]">
            {currentUser?.name}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#a78bfa]/20 border border-[#a78bfa]/30 flex items-center justify-center text-xs font-semibold text-[#a78bfa]">
            {currentUser?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <button
            onClick={logout}
            className="text-xs text-[#4d6b8a] hover:text-[#8ba3c7] transition-colors px-2 py-1 border border-white/8 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className={`${
            sidebarOpen ? "flex" : "hidden"
          } md:flex flex-col w-52 border-r border-white/8 bg-[#0b1120] fixed md:sticky top-14 h-[calc(100vh-3.5rem)] z-30 overflow-y-auto`}
        >
          <nav className="p-4 space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id)
                  setSidebarOpen(false)
                }}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all ${
                  tab === t.id
                    ? "bg-[#a78bfa]/15 text-[#a78bfa]"
                    : "text-[#8ba3c7] hover:bg-white/5 hover:text-[#f0f4ff]"
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto p-4 border-t border-white/8">
            <div className="text-[10px] font-mono tracking-widest text-[#4d6b8a] uppercase mb-2">
              Role
            </div>
            <div className="text-sm text-[#8ba3c7]">System Administrator</div>
            <div className="text-xs text-[#4d6b8a] mt-1">Full access</div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {notice && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-[#a78bfa]/25 bg-[#a78bfa]/10 px-4 py-3 text-sm text-[#c4b5fd]">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                className="text-xs text-[#8ba3c7] hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-8">
              <div>
                <h1
                  className="text-2xl font-semibold mb-1"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Admin Overview
                </h1>
                <p className="text-[#8ba3c7] text-sm">
                  Institution-wide view · 4 departments · AY 2025-26
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Students",
                    value: "1,600",
                    sub: "4 departments",
                    color: "#a78bfa",
                  },
                  {
                    label: "Faculty Members",
                    value: "61",
                    sub: "Across all depts",
                    color: "#38bdf8",
                  },
                  {
                    label: "Daily Queries",
                    value: "847",
                    sub: "Today via RAG",
                    color: "#f5a623",
                  },
                  {
                    label: "Docs Indexed",
                    value: "42,891",
                    sub: "Chunks in vector DB",
                    color: "#4ade80",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-[#131e33] border border-white/8 rounded-xl p-5"
                  >
                    <div className="text-xs text-[#4d6b8a] mb-2">{s.label}</div>
                    <div
                      className="text-3xl font-semibold mb-1"
                      style={{ fontFamily: "Fraunces, serif", color: s.color }}
                    >
                      {s.value}
                    </div>
                    <div className="text-xs text-[#8ba3c7]">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Dept attendance heatmap */}
              <div className="bg-[#131e33] border border-white/8 rounded-xl p-6">
                <h2
                  className="font-semibold mb-5"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Department Attendance Overview
                </h2>
                <div className="space-y-4">
                  {DEPT_STATS.map((d) => (
                    <div key={d.dept} className="flex items-center gap-4">
                      <div className="w-36 text-sm text-[#8ba3c7] flex-shrink-0">
                        {d.dept}
                      </div>
                      <div className="flex-1 h-6 bg-[#0b1120] rounded overflow-hidden relative">
                        <div
                          className="h-full rounded transition-all flex items-center"
                          style={{
                            width: `${d.avgAttendance}%`,
                            background:
                              d.avgAttendance >= 75
                                ? "linear-gradient(90deg, #a78bfa, #7c3aed)"
                                : "linear-gradient(90deg, #f87171, #dc2626)",
                          }}
                        >
                          <span className="text-[10px] text-white font-mono ml-2">
                            {d.avgAttendance}%
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[#4d6b8a] w-12 text-right font-mono">
                        {d.students}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit + AI side by side */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-[#131e33] border border-white/8 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="font-semibold"
                      style={{ fontFamily: "Fraunces, serif" }}
                    >
                      Recent Audit Events
                    </h2>
                    <button
                      onClick={() => setTab("audit")}
                      className="text-xs text-[#a78bfa] hover:text-[#c4b5fd]"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {AUDIT_LOG.slice(0, 4).map((l, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            l.result === "blocked"
                              ? "bg-red-400"
                              : "bg-green-400"
                          }`}
                        />
                        <span className="text-[#8ba3c7] flex-1 truncate">
                          {l.query}
                        </span>
                        <span className="text-[#4d6b8a] font-mono flex-shrink-0">
                          {l.time.split(" ")[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#131e33] border border-[#a78bfa]/20 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#a78bfa]">✦</span>
                    <span className="text-sm font-semibold">
                      AI Quick Actions
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Summarize enrollment across departments",
                      "System health report",
                      "Draft exam notification",
                      "Performance across departments",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setTab("chat")
                          setTimeout(() => sendMessage(q), 200)
                        }}
                        className="w-full text-left text-xs border border-white/8 text-[#8ba3c7] px-3 py-2 rounded hover:border-[#a78bfa]/40 hover:text-[#a78bfa] transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && (
            <div className="space-y-8">
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Cross-Department Analytics
              </h1>
              <div className="bg-[#131e33] border border-white/8 rounded-xl p-6">
                <h2
                  className="font-semibold mb-6"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Average CGPA by Department
                </h2>
                <div className="flex items-end gap-6 h-40">
                  {DEPT_STATS.map((d) => {
                    const pct = ((d.avgCGPA - 6) / (10 - 6)) * 100
                    return (
                      <div
                        key={d.dept}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <span className="text-xs text-[#a78bfa] font-mono">
                          {d.avgCGPA}
                        </span>
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${pct}%`,
                            background:
                              "linear-gradient(to top, #a78bfa, #a78bfa88)",
                            minHeight: 12,
                          }}
                        />
                        <span className="text-[10px] text-[#4d6b8a] text-center">
                          {d.dept.split(" ")[0]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {DEPT_STATS.map((d) => (
                  <div
                    key={d.dept}
                    className="bg-[#131e33] border border-white/8 rounded-xl p-6"
                  >
                    <h3
                      className="font-semibold mb-4"
                      style={{ fontFamily: "Fraunces, serif" }}
                    >
                      {d.dept}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        {
                          label: "Students",
                          value: d.students,
                          color: "#a78bfa",
                        },
                        {
                          label: "Faculty",
                          value: d.faculty,
                          color: "#38bdf8",
                        },
                        {
                          label: "Avg Attendance",
                          value: `${d.avgAttendance}%`,
                          color: d.avgAttendance >= 75 ? "#4ade80" : "#f87171",
                        },
                        {
                          label: "Avg CGPA",
                          value: d.avgCGPA,
                          color: "#f5a623",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="bg-[#0b1120] rounded-lg p-3"
                        >
                          <div className="text-[10px] text-[#4d6b8a] mb-1">
                            {s.label}
                          </div>
                          <div
                            className="font-semibold"
                            style={{ color: s.color }}
                          >
                            {s.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTS */}
          {tab === "documents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1
                  className="text-2xl font-semibold"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  RAG Knowledge Base
                </h1>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) uploadDocument(file)
                    event.target.value = ""
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm bg-[#a78bfa] text-[#0b1120] font-semibold px-4 py-2 rounded hover:bg-[#c4b5fd] transition-colors"
                >
                  + Upload Document
                </button>
              </div>
              <div className="bg-[#131e33] border border-white/8 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase">
                        Document
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase hidden md:table-cell">
                        Type
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase hidden sm:table-cell">
                        Updated
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase">
                        Indexed
                      </th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((d) => (
                      <tr
                        key={d.name}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-[#4d6b8a]">
                            {d.size} · {d.dept}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/8 text-[#8ba3c7]">
                            {d.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#4d6b8a] text-xs font-mono hidden sm:table-cell">
                          {d.updated}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              d.indexed
                                ? "bg-green-500/15 text-green-400"
                                : "bg-yellow-500/15 text-yellow-400"
                            }`}
                          >
                            {d.indexed ? "✓ Indexed" : "⏳ Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => editDocument(d.name)}
                            className="text-xs text-[#8ba3c7] hover:text-[#f0f4ff]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeDocument(d.name)}
                            className="text-xs text-red-400/60 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h1
                  className="text-2xl font-semibold"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  User Management
                </h1>
                <button
                  type="button"
                  onClick={addUser}
                  className="text-sm bg-[#a78bfa] text-[#0b1120] font-semibold px-4 py-2 rounded hover:bg-[#c4b5fd] transition-colors"
                >
                  + Add User
                </button>
              </div>
              <div className="flex gap-2">
                {["all", "student", "professor"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setUserFilter(f)}
                    className={`px-4 py-1.5 rounded text-sm capitalize transition-all ${
                      userFilter === f
                        ? "bg-[#1a2843] text-[#a78bfa]"
                        : "border border-white/8 text-[#8ba3c7] hover:text-[#f0f4ff]"
                    }`}
                  >
                    {f === "all" ? "All Users" : f + "s"}
                  </button>
                ))}
              </div>
              <div className="bg-[#131e33] border border-white/8 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase">
                        User
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase hidden sm:table-cell">
                        Role
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase hidden md:table-cell">
                        Department
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.email}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-[#4d6b8a] font-mono">
                            {u.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded capitalize"
                            style={{
                              background:
                                u.role === "student"
                                  ? "#f5a62320"
                                  : u.role === "professor"
                                    ? "#38bdf820"
                                    : "#a78bfa20",
                              color:
                                u.role === "student"
                                  ? "#f5a623"
                                  : u.role === "professor"
                                    ? "#38bdf8"
                                    : "#a78bfa",
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#8ba3c7] hidden md:table-cell">
                          {u.dept}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              u.status === "active"
                                ? "bg-green-500/15 text-green-400"
                                : "bg-white/8 text-[#4d6b8a]"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(u.email)}
                            className="text-xs text-[#8ba3c7] hover:text-[#f0f4ff]"
                          >
                            {u.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI CHAT */}
          {tab === "chat" && (
            <div className="h-[calc(100vh-8rem)] flex flex-col max-w-2xl mx-auto">
              <h1
                className="text-2xl font-semibold mb-4 flex-shrink-0"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Admin AI Assistant
              </h1>
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${
                      m.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                        m.role === "user"
                          ? "bg-[#a78bfa]/20 text-[#a78bfa]"
                          : "bg-[#1a2843] text-[#a78bfa]"
                      }`}
                    >
                      {m.role === "user" ? "RK" : "✦"}
                    </div>
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                        m.role === "user"
                          ? "bg-[#a78bfa]/15 text-[#f0f4ff]"
                          : "bg-[#131e33] border border-white/8 text-[#c8d8ef]"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1a2843] flex items-center justify-center text-[10px] text-[#a78bfa]">
                      ✦
                    </div>
                    <div className="bg-[#131e33] border border-white/8 px-4 py-3 rounded-xl flex gap-1.5 items-center">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#8ba3c7] animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#8ba3c7] animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#8ba3c7] animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="flex-shrink-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    "Enrollment summary",
                    "System health report",
                    "Draft exam notice",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs border border-white/10 text-[#8ba3c7] px-3 py-1.5 rounded-full hover:border-[#a78bfa]/40 hover:text-[#a78bfa] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask about enrollment, performance, system health…"
                    className="flex-1 bg-[#131e33] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4d6b8a] focus:outline-none focus:border-[#a78bfa]/50 transition-colors"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={aiTyping}
                    className="bg-[#a78bfa] text-[#0b1120] font-semibold px-4 py-3 rounded-lg hover:bg-[#c4b5fd] transition-colors disabled:opacity-50 text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AUDIT LOG */}
          {tab === "audit" && (
            <div className="space-y-6">
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Audit Log
              </h1>
              <div className="bg-[#131e33] border border-white/8 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase">
                        User
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase hidden md:table-cell">
                        Query
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase">
                        Result
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase hidden sm:table-cell">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUDIT_LOG.map((l, i) => (
                      <tr
                        key={i}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-xs font-mono text-[#8ba3c7]">
                            {l.user}
                          </div>
                          <span
                            className="text-[10px] font-mono capitalize"
                            style={{
                              color:
                                l.role === "student"
                                  ? "#f5a623"
                                  : l.role === "professor"
                                    ? "#38bdf8"
                                    : "#a78bfa",
                            }}
                          >
                            {l.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#8ba3c7] hidden md:table-cell max-w-xs truncate">
                          {l.query}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              l.result === "blocked"
                                ? "bg-red-500/15 text-red-400"
                                : "bg-green-500/15 text-green-400"
                            }`}
                          >
                            {l.result === "blocked"
                              ? "🚫 Blocked"
                              : "✓ Answered"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#4d6b8a] text-xs font-mono hidden sm:table-cell">
                          {l.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SYSTEM */}
          {tab === "system" && (
            <div className="space-y-6">
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                System Health
              </h1>
              <div className="space-y-4">
                {SYSTEM.map((s) => (
                  <div
                    key={s.label}
                    className="bg-[#131e33] border border-white/8 rounded-xl p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <div
                          className="font-semibold"
                          style={{ fontFamily: "Fraunces, serif" }}
                        >
                          {s.label}
                        </div>
                        <div className="text-xs text-[#8ba3c7] mt-0.5">
                          Latency: {s.latency}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2.5 py-1 rounded ${
                          s.status === "online"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        {s.status === "online" ? "● Online" : "⟳ Indexing"}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[#4d6b8a]">Load</span>
                        <span
                          className={
                            s.load > 70 ? "text-yellow-400" : "text-[#4d6b8a]"
                          }
                        >
                          {s.load}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#0b1120] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${s.load}%`,
                            background: s.load > 70 ? "#f5a623" : "#a78bfa",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#131e33] border border-white/8 rounded-xl p-6">
                <h2
                  className="font-semibold mb-4"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Query Volume — Today
                </h2>
                <div className="flex items-end gap-2 h-24">
                  {[32, 41, 28, 67, 89, 94, 78, 102, 88, 71, 55, 43].map(
                    (v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t"
                        style={{
                          height: `${(v / 110) * 100}%`,
                          background:
                            "linear-gradient(to top, #a78bfa, #a78bfa66)",
                          minHeight: 4,
                        }}
                      />
                    ),
                  )}
                </div>
                <div className="flex justify-between text-[10px] text-[#4d6b8a] font-mono mt-2">
                  <span>6AM</span>
                  <span>12PM</span>
                  <span>6PM</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

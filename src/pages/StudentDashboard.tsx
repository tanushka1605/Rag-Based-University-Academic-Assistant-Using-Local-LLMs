import { useState, useRef, useEffect } from "react"
import { useNav } from "../App"

const COURSES = [
  {
    name: "Data Structures",
    code: "CS301",
    attendance: 82,
    grade: "A",
    credits: 4,
    nextExam: "14 Nov 2025",
  },
  {
    name: "Operating Systems",
    code: "CS302",
    attendance: 74,
    grade: "B+",
    credits: 4,
    nextExam: "18 Nov 2025",
  },
  {
    name: "Database Systems",
    code: "CS303",
    attendance: 91,
    grade: "A+",
    credits: 3,
    nextExam: "21 Nov 2025",
  },
  {
    name: "Computer Networks",
    code: "CS304",
    attendance: 68,
    grade: "B",
    credits: 3,
    nextExam: "25 Nov 2025",
  },
  {
    name: "Software Engineering",
    code: "CS305",
    attendance: 88,
    grade: "A",
    credits: 3,
    nextExam: "28 Nov 2025",
  },
]

const UPCOMING = [
  {
    title: "Data Structures Mid-Sem",
    date: "14 Nov",
    time: "10:00 AM",
    venue: "Hall B-204",
    type: "exam",
    color: "#f5a623",
  },
  {
    title: "OS Assignment Submission",
    date: "15 Nov",
    time: "11:59 PM",
    venue: "Portal",
    type: "assignment",
    color: "#38bdf8",
  },
  {
    title: "DBMS Lab Practical",
    date: "17 Nov",
    time: "2:00 PM",
    venue: "Lab-3",
    type: "lab",
    color: "#a78bfa",
  },
  {
    title: "CN Quiz — Unit 4",
    date: "20 Nov",
    time: "9:00 AM",
    venue: "Hall A-101",
    type: "quiz",
    color: "#f5a623",
  },
  {
    title: "SE Project Presentation",
    date: "28 Nov",
    time: "3:00 PM",
    venue: "Seminar Hall",
    type: "exam",
    color: "#f472b6",
  },
]

const NOTICES = [
  {
    title: "Mid-semester examination timetable released",
    date: "2 Nov 2025",
    summary: "Exams run 14–30 Nov. Hall assignments updated in the portal.",
    urgent: true,
  },
  {
    title: "Library extended hours during exam season",
    date: "1 Nov 2025",
    summary:
      "Library open until 11 PM from 10 Nov. Digital resources available 24/7.",
    urgent: false,
  },
  {
    title: "Scholarship portal open for Sem 5 students",
    date: "29 Oct 2025",
    summary:
      "Merit-cum-means applications due 20 Nov. Documents required: marksheets + income certificate.",
    urgent: false,
  },
]

const PERF = [
  { sem: "Sem 1", cgpa: 7.2 },
  { sem: "Sem 2", cgpa: 7.8 },
  { sem: "Sem 3", cgpa: 8.1 },
  { sem: "Sem 4", cgpa: 8.4 },
  { sem: "Sem 5", cgpa: 8.7 },
]

const AI_RESPONSES: Record<string, string> = {
  default:
    "I've retrieved the relevant sections from your course documents. Could you be more specific about which subject or topic you need help with?",
  exam: "Based on ExamSchedule_Sem5.xlsx: Your next exam is Data Structures on 14 Nov 2025 at 10:00 AM in Hall B-204. Focus areas: AVL Trees, Graph Traversals (BFS/DFS), and Dynamic Programming — DP appeared in 70% of past papers.\n\n📎 Source: DS_PastPapers_2023-24.pdf",
  attendance:
    "Per AcademicPolicy_2024-25.pdf §3.1: Minimum attendance is 75% per subject. Your current risk subjects: Computer Networks (68% ⚠️). You need 3 more consecutive CN classes to reach 70%. Contact HOD for medical condonation if applicable.\n\n📎 Source: AcademicPolicy_2024-25.pdf",
  syllabus:
    "Operating Systems Unit 3 covers: Process Synchronization (Semaphores, Monitors), Deadlock Detection & Recovery, Memory Management (Paging, Segmentation). Expected exam weightage: 35% of paper.\n\n📎 Source: OS_Syllabus_Sem5.pdf Unit 3",
  cgpa: "Your current CGPA is 8.7 (Sem 5 projected). Trend: 7.2 → 7.8 → 8.1 → 8.4 → 8.7 — consistent improvement of ~0.4 per semester. You are in the top 15% of your batch based on department records.\n\n📎 Source: GradeReport_Sem1-4.pdf",
  schedule:
    "Your study planner suggestion: With DS exam on 14 Nov, prioritize: Day 1-2: AVL Trees & Red-Black Trees, Day 3-4: Graph algorithms (Dijkstra, Floyd-Warshall), Day 5-6: DP (0/1 Knapsack, LCS). Leave Day 7 for revision.\n\n📎 Source: DS_Syllabus.pdf + ExamSchedule",
}

function getAIResponse(query: string): string {
  const q = query.toLowerCase()
  if (q.includes("exam") || q.includes("test") || q.includes("date"))
    return AI_RESPONSES.exam
  if (q.includes("attendance") || q.includes("policy") || q.includes("absent"))
    return AI_RESPONSES.attendance
  if (
    q.includes("syllabus") ||
    q.includes("unit") ||
    q.includes("topic") ||
    q.includes("os") ||
    q.includes("operating")
  )
    return AI_RESPONSES.syllabus
  if (
    q.includes("cgpa") ||
    q.includes("gpa") ||
    q.includes("grade") ||
    q.includes("performance")
  )
    return AI_RESPONSES.cgpa
  if (
    q.includes("study") ||
    q.includes("plan") ||
    q.includes("revise") ||
    q.includes("schedule")
  )
    return AI_RESPONSES.schedule
  return AI_RESPONSES.default
}

type Tab = "overview" | "courses" | "chat" | "notices" | "timetable"

export default function StudentDashboard() {
  const { currentUser, logout, navigate } = useNav()
  const [tab, setTab] = useState<Tab>("overview")
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<{
    role: "user" | "ai"
    text: string
  }[]>([
    {
      role: "ai",
      text: "Hello! I'm your academic assistant. Ask me about exams, attendance, syllabus topics, or your performance.",
    },
  ])
  const [aiTyping, setAiTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, aiTyping])

  const sendMessage = () => {
    if (!chatInput.trim() || aiTyping) return
    const userMsg = chatInput.trim()
    setChatInput("")
    setMessages((m) => [...m, { role: "user", text: userMsg }])
    setAiTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: getAIResponse(userMsg) }])
      setAiTyping(false)
    }, 1200)
  }

  const avgAttendance = Math.round(
    COURSES.reduce((s, c) => s + c.attendance, 0) / COURSES.length,
  )

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "chat", label: "AI Assistant", icon: "✦" },
    { id: "notices", label: "Notices", icon: "📋" },
    { id: "timetable", label: "Upcoming", icon: "📅" },
  ]

  return (
    <div className="min-h-full bg-[#0b1120] text-[#f0f4ff] flex flex-col">
      {/* Top bar */}
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
            className="w-6 h-6 rounded bg-[#f5a623] flex items-center justify-center text-[#0b1120] font-bold text-[10px]"
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
            / Student
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-[#8ba3c7]">
            {currentUser?.name}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#f5a623]/20 border border-[#f5a623]/30 flex items-center justify-center text-xs font-semibold text-[#f5a623]">
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
        {/* Sidebar */}
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
                    ? "bg-[#f5a623]/15 text-[#f5a623]"
                    : "text-[#8ba3c7] hover:bg-white/5 hover:text-[#f0f4ff]"
                }`}
              >
                <span className="text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto p-4 border-t border-white/8">
            <div className="text-[10px] font-mono tracking-widest text-[#4d6b8a] uppercase mb-2">
              Enrolled
            </div>
            <div className="text-sm text-[#8ba3c7]">B.Tech CSE · Sem 5</div>
            <div className="text-xs text-[#4d6b8a] mt-1">Roll: 2021CSE0047</div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-8">
              <div>
                <h1
                  className="text-2xl font-semibold mb-1"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Good morning, {currentUser?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-[#8ba3c7] text-sm">
                  Semester 5 · Mid-semester exams begin 14 Nov 2025
                </p>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Current CGPA",
                    value: "8.7",
                    sub: "Top 15% of batch",
                    color: "#f5a623",
                  },
                  {
                    label: "Avg Attendance",
                    value: `${avgAttendance}%`,
                    sub: "2 subjects at risk",
                    color: avgAttendance >= 75 ? "#4ade80" : "#f87171",
                  },
                  {
                    label: "Active Courses",
                    value: "5",
                    sub: "17 credits this sem",
                    color: "#38bdf8",
                  },
                  {
                    label: "Days to First Exam",
                    value: "9",
                    sub: "DS · 14 Nov",
                    color: "#a78bfa",
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

              {/* Perf chart */}
              <div className="bg-[#131e33] border border-white/8 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="font-semibold"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    CGPA Progression
                  </h2>
                  <span className="text-xs text-[#4d6b8a] font-mono">
                    Sem 1–5
                  </span>
                </div>
                <div className="flex items-end gap-4 h-32">
                  {PERF.map((p) => {
                    const pct = ((p.cgpa - 6) / (10 - 6)) * 100
                    return (
                      <div
                        key={p.sem}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <span className="text-xs text-[#f5a623] font-mono">
                          {p.cgpa}
                        </span>
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${pct}%`,
                            background:
                              "linear-gradient(to top, #f5a623, #f5a623aa)",
                            minHeight: 12,
                          }}
                        />
                        <span className="text-[10px] text-[#4d6b8a]">
                          {p.sem}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Upcoming events */}
              <div className="bg-[#131e33] border border-white/8 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="font-semibold"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    Upcoming
                  </h2>
                  <button
                    onClick={() => setTab("timetable")}
                    className="text-xs text-[#f5a623] hover:text-[#fbbf55]"
                  >
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {UPCOMING.slice(0, 3).map((ev) => (
                    <div
                      key={ev.title}
                      className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0"
                    >
                      <div className="text-center min-w-[2.5rem]">
                        <div
                          className="text-xs font-mono"
                          style={{ color: ev.color }}
                        >
                          {ev.date.split(" ")[0]}
                        </div>
                        <div className="text-[9px] text-[#4d6b8a]">
                          {ev.date.split(" ")[1]}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{ev.title}</div>
                        <div className="text-xs text-[#4d6b8a]">
                          {ev.time} · {ev.venue}
                        </div>
                      </div>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-mono"
                        style={{ background: ev.color + "20", color: ev.color }}
                      >
                        {ev.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick ask */}
              <div className="bg-[#131e33] border border-[#f5a623]/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#f5a623]">✦</span>
                  <span className="text-sm font-semibold">Quick Ask</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "When is my next exam?",
                    "Am I at attendance risk?",
                    "Summarize OS Unit 3",
                    "Create a study plan",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setTab("chat")
                        setTimeout(() => {
                          setChatInput(q)
                        }, 100)
                      }}
                      className="text-xs border border-white/10 text-[#8ba3c7] px-3 py-1.5 rounded-full hover:border-[#f5a623]/40 hover:text-[#f5a623] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* COURSES */}
          {tab === "courses" && (
            <div className="space-y-6">
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                My Courses
              </h1>
              <div className="space-y-3">
                {COURSES.map((c) => (
                  <div
                    key={c.code}
                    className="bg-[#131e33] border border-white/8 rounded-xl p-6 hover:border-white/15 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-mono text-[#4d6b8a] mb-1">
                          {c.code} · {c.credits} credits
                        </div>
                        <div
                          className="font-semibold text-lg"
                          style={{ fontFamily: "Fraunces, serif" }}
                        >
                          {c.name}
                        </div>
                        <div className="text-xs text-[#8ba3c7] mt-1">
                          Next exam: {c.nextExam}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-xs text-[#4d6b8a] mb-1">
                            Grade
                          </div>
                          <div
                            className="font-semibold text-[#f5a623]"
                            style={{ fontFamily: "Fraunces, serif" }}
                          >
                            {c.grade}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#4d6b8a] mb-1">
                            Attendance
                          </div>
                          <div
                            className={`font-semibold ${
                              c.attendance >= 75
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                            style={{ fontFamily: "Fraunces, serif" }}
                          >
                            {c.attendance}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] text-[#4d6b8a] mb-1.5">
                        <span>Attendance</span>
                        <span
                          className={
                            c.attendance < 75
                              ? "text-red-400"
                              : "text-green-400"
                          }
                        >
                          {c.attendance < 75 ? "⚠ Below 75%" : "✓ Safe"}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#0b1120] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${c.attendance}%`,
                            background:
                              c.attendance >= 75 ? "#4ade80" : "#f87171",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                AI Academic Assistant
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
                          ? "bg-[#f5a623]/20 text-[#f5a623]"
                          : "bg-[#1a2843] text-[#38bdf8]"
                      }`}
                    >
                      {m.role === "user"
                        ? currentUser?.name?.split(" ")[0][0]
                        : "✦"}
                    </div>
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                        m.role === "user"
                          ? "bg-[#f5a623]/15 text-[#f0f4ff]"
                          : "bg-[#131e33] border border-white/8 text-[#c8d8ef]"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1a2843] flex items-center justify-center text-[10px] text-[#38bdf8]">
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
                    "When is my next exam?",
                    "Attendance risk?",
                    "Study plan for DS",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setChatInput(q)}
                      className="text-xs border border-white/10 text-[#8ba3c7] px-3 py-1.5 rounded-full hover:border-[#f5a623]/40 hover:text-[#f5a623] transition-all"
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
                    placeholder="Ask about exams, attendance, syllabus…"
                    className="flex-1 bg-[#131e33] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4d6b8a] focus:outline-none focus:border-[#f5a623]/50 transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={aiTyping}
                    className="bg-[#f5a623] text-[#0b1120] font-semibold px-4 py-3 rounded-lg hover:bg-[#fbbf55] transition-colors disabled:opacity-50 text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTICES */}
          {tab === "notices" && (
            <div className="space-y-6 max-w-2xl">
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Notice Board
              </h1>
              <div className="space-y-4">
                {NOTICES.map((n) => (
                  <div
                    key={n.title}
                    className={`bg-[#131e33] border rounded-xl p-6 ${
                      n.urgent ? "border-[#f5a623]/30" : "border-white/8"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className="font-semibold"
                        style={{ fontFamily: "Fraunces, serif" }}
                      >
                        {n.title}
                      </h3>
                      {n.urgent && (
                        <span className="flex-shrink-0 text-[10px] font-mono tracking-widest bg-[#f5a623]/15 text-[#f5a623] px-2 py-0.5 rounded">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#8ba3c7] leading-relaxed">
                      {n.summary}
                    </p>
                    <div className="mt-3 text-xs text-[#4d6b8a] font-mono">
                      {n.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIMETABLE */}
          {tab === "timetable" && (
            <div className="space-y-6 max-w-2xl">
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Upcoming Events
              </h1>
              <div className="space-y-3">
                {UPCOMING.map((ev) => (
                  <div
                    key={ev.title}
                    className="bg-[#131e33] border border-white/8 rounded-xl p-5 flex items-center gap-5 hover:border-white/15 transition-colors"
                  >
                    <div className="text-center min-w-[3rem] flex-shrink-0">
                      <div
                        className="text-xl font-semibold"
                        style={{
                          fontFamily: "Fraunces, serif",
                          color: ev.color,
                        }}
                      >
                        {ev.date.split(" ")[0]}
                      </div>
                      <div className="text-xs text-[#4d6b8a]">
                        {ev.date.split(" ")[1]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-xs text-[#8ba3c7] mt-1">
                        {ev.time} · {ev.venue}
                      </div>
                    </div>
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-mono capitalize"
                      style={{ background: ev.color + "20", color: ev.color }}
                    >
                      {ev.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

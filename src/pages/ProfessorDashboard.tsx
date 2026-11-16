import { useState, useRef, useEffect } from "react"
import { useNav } from "../App"

const CLASSES = [
  {
    name: "Data Structures",
    code: "CS301",
    batch: "CSE-B",
    students: 62,
    avgAttendance: 78,
    avgScore: 71,
    coverage: 65,
  },
  {
    name: "Algorithms",
    code: "CS401",
    batch: "CSE-C",
    students: 58,
    avgAttendance: 82,
    avgScore: 68,
    coverage: 80,
  },
  {
    name: "Theory of Computation",
    code: "CS501",
    batch: "CSE-A",
    students: 55,
    avgAttendance: 69,
    avgScore: 74,
    coverage: 55,
  },
]

const RECENT_SUBMISSIONS = [
  {
    student: "Arjun Sharma",
    roll: "2021CSE0047",
    assignment: "DS Unit 4 Assignment",
    score: 88,
    time: "2h ago",
  },
  {
    student: "Sneha Patel",
    roll: "2021CSE0023",
    assignment: "DS Unit 4 Assignment",
    score: 94,
    time: "3h ago",
  },
  {
    student: "Kiran Reddy",
    roll: "2021CSE0061",
    assignment: "DS Unit 4 Assignment",
    score: 72,
    time: "5h ago",
  },
  {
    student: "Meera Joshi",
    roll: "2021CSE0034",
    assignment: "Algorithms Lab 6",
    score: 85,
    time: "1d ago",
  },
]

const WEAK_TOPICS = [
  { class: "CS301", topic: "Dynamic Programming", correctRate: 42 },
  { class: "CS301", topic: "Graph Traversals (Advanced)", correctRate: 56 },
  { class: "CS501", topic: "PDA Construction", correctRate: 38 },
  { class: "CS401", topic: "NP-Completeness Proofs", correctRate: 47 },
]

const SCHEDULE = [
  {
    time: "9:00 AM",
    subject: "Data Structures",
    batch: "CSE-B",
    room: "Hall B-204",
    type: "lecture",
  },
  {
    time: "11:00 AM",
    subject: "Algorithms",
    batch: "CSE-C",
    room: "Hall A-101",
    type: "lecture",
  },
  {
    time: "2:00 PM",
    subject: "DS Lab",
    batch: "CSE-B",
    room: "Lab-2",
    type: "lab",
  },
  {
    time: "4:00 PM",
    subject: "Office Hours",
    batch: "Open",
    room: "Faculty Room 14",
    type: "office",
  },
]

const QUIZ_TEMPLATES = [
  "Generate 10 MCQs on AVL Trees from DS Unit 3",
  "Create a 5-question short-answer quiz on Process Synchronization",
  "Make a question paper on Graph Algorithms (2 marks × 5, 5 marks × 3)",
  "Generate 8 True/False questions on NP-Completeness",
]

const AI_RESPONSES: Record<string, string> = {
  default:
    "I can help you generate quizzes, analyze class performance, or summarize course material. What would you like to do?",
  quiz: "Here are 5 MCQs on AVL Trees from DS Unit 3:\n\n1. What is the maximum height imbalance allowed in an AVL tree?\n   A) 1 ✓  B) 2  C) 0  D) 3\n\n2. Which rotation fixes Left-Right imbalance?\n   A) Single Left  B) Double Left-Right ✓  C) Single Right  D) Double Right-Left\n\n3. Time complexity of insertion in AVL tree:\n   A) O(n)  B) O(log n) ✓  C) O(n log n)  D) O(1)\n\n📎 Source: DS_Syllabus_Unit3.pdf + QuestionBank_CS301.pdf",
  performance:
    "Class CS301 Performance Summary:\n• Average score: 71/100 (below department avg of 76)\n• Weak topics: Dynamic Programming (42% correct), Advanced Graphs (56%)\n• Top 10% students: Sneha Patel (94), Arjun Sharma (88), Kiran Reddy (86)\n• Recommended action: Schedule extra DP session before mid-sem\n\n📎 Source: GradeReport_CS301_Sem5.xlsx",
  attendance:
    "CS301 CSE-B Attendance Report:\n• Class average: 78% (above minimum 75%)\n• At-risk students (< 75%): 8 students\n• Lowest: Rohan Gupta 61%, Aisha Khan 63%\n• Recommendation: Send attendance warning to 8 students before 10 Nov cutoff\n\n📎 Source: AttendanceRegister_CS301_Nov2025.xlsx",
  syllabus:
    "CS301 Coverage Status:\n• Units 1-2: 100% covered ✓\n• Unit 3 (Trees): 80% covered\n• Unit 4 (Graphs): 45% — needs 6 more lectures\n• Unit 5 (DP): 0% — 8 lectures needed\n⚠ At current pace, Unit 5 will not be completed before mid-sem\n\n📎 Source: DS_Syllabus_CS301.pdf + LectureLog_Nov2025.xlsx",
}

function getProfAIResponse(query: string): string {
  const q = query.toLowerCase()
  if (
    q.includes("quiz") ||
    q.includes("mcq") ||
    q.includes("question") ||
    q.includes("avl")
  )
    return AI_RESPONSES.quiz
  if (
    q.includes("performance") ||
    q.includes("score") ||
    q.includes("marks") ||
    q.includes("grade")
  )
    return AI_RESPONSES.performance
  if (q.includes("attendance") || q.includes("absent") || q.includes("risk"))
    return AI_RESPONSES.attendance
  if (
    q.includes("syllabus") ||
    q.includes("coverage") ||
    q.includes("unit") ||
    q.includes("topic")
  )
    return AI_RESPONSES.syllabus
  return AI_RESPONSES.default
}

type Tab = "overview" | "classes" | "chat" | "schedule" | "submissions"

export default function ProfessorDashboard() {
  const { currentUser, logout } = useNav()
  const [tab, setTab] = useState<Tab>("overview")
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<{
    role: "user" | "ai"
    text: string
  }[]>([
    {
      role: "ai",
      text: "Hello Dr. Mehta! I can generate quiz questions, analyze class performance, check syllabus coverage, or flag attendance risks. What do you need?",
    },
  ])
  const [aiTyping, setAiTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(CLASSES[0])
  const [selectedSubmission, setSelectedSubmission] =
    useState<typeof RECENT_SUBMISSIONS[number] | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

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
      setMessages((m) => [...m, { role: "ai", text: getProfAIResponse(msg) }])
      setAiTyping(false)
    }, 1300)
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "classes", label: "My Classes", icon: "🎓" },
    { id: "chat", label: "AI Assistant", icon: "✦" },
    { id: "schedule", label: "Today's Schedule", icon: "📅" },
    { id: "submissions", label: "Submissions", icon: "📝" },
  ]

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
            className="w-6 h-6 rounded bg-[#38bdf8] flex items-center justify-center text-[#0b1120] font-bold text-[10px]"
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
            / Professor
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-[#8ba3c7]">
            {currentUser?.name}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#38bdf8]/20 border border-[#38bdf8]/30 flex items-center justify-center text-xs font-semibold text-[#38bdf8]">
            {currentUser?.name
              ?.split(" ")
              .filter((_, i) => i > 0)
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "PM"}
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
                    ? "bg-[#38bdf8]/15 text-[#38bdf8]"
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
              Department
            </div>
            <div className="text-sm text-[#8ba3c7]">Computer Science</div>
            <div className="text-xs text-[#4d6b8a] mt-1">
              Faculty ID: CSE-FAC-014
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-8">
              <div>
                <h1
                  className="text-2xl font-semibold mb-1"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Welcome back, {currentUser?.name} 👋
                </h1>
                <p className="text-[#8ba3c7] text-sm">
                  Teaching 3 courses this semester · Mid-semester period active
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Students",
                    value: "175",
                    sub: "Across 3 classes",
                    color: "#38bdf8",
                  },
                  {
                    label: "Avg Attendance",
                    value: "76%",
                    sub: "Above 75% threshold",
                    color: "#4ade80",
                  },
                  {
                    label: "Avg Class Score",
                    value: "71/100",
                    sub: "Dept avg: 76",
                    color: "#f5a623",
                  },
                  {
                    label: "Pending Reviews",
                    value: "12",
                    sub: "Assignments to grade",
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

              {/* Weak topics */}
              <div className="bg-[#131e33] border border-white/8 rounded-xl p-6">
                <h2
                  className="font-semibold mb-5"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Weak Topics Across Classes
                </h2>
                <div className="space-y-4">
                  {WEAK_TOPICS.map((w) => (
                    <div key={w.topic}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span>
                          {w.topic}{" "}
                          <span className="text-xs text-[#4d6b8a] font-mono ml-1">
                            {w.class}
                          </span>
                        </span>
                        <span
                          className={
                            w.correctRate < 50
                              ? "text-red-400"
                              : "text-[#f5a623]"
                          }
                        >
                          {w.correctRate}% correct
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#0b1120] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${w.correctRate}%`,
                            background:
                              w.correctRate < 50 ? "#f87171" : "#f5a623",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's schedule quick view */}
              <div className="bg-[#131e33] border border-white/8 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="font-semibold"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    Today, 5 Nov 2025
                  </h2>
                  <button
                    onClick={() => setTab("schedule")}
                    className="text-xs text-[#38bdf8] hover:text-[#7dd3fc]"
                  >
                    Full schedule →
                  </button>
                </div>
                <div className="space-y-3">
                  {SCHEDULE.slice(0, 3).map((s) => (
                    <div key={s.time} className="flex items-center gap-4">
                      <div className="text-xs font-mono text-[#4d6b8a] w-16 flex-shrink-0">
                        {s.time}
                      </div>
                      <div className="flex-1 text-sm">{s.subject}</div>
                      <div className="text-xs text-[#8ba3c7]">{s.room}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI quick actions */}
              <div className="bg-[#131e33] border border-[#38bdf8]/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#38bdf8]">✦</span>
                  <span className="text-sm font-semibold">
                    Generate with AI
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUIZ_TEMPLATES.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setTab("chat")
                        setTimeout(() => sendMessage(q), 200)
                      }}
                      className="text-xs border border-white/10 text-[#8ba3c7] px-3 py-1.5 rounded-full hover:border-[#38bdf8]/40 hover:text-[#38bdf8] transition-all text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CLASSES */}
          {tab === "classes" && (
            <div className="space-y-6">
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                My Classes
              </h1>
              <div className="flex gap-2 flex-wrap mb-6">
                {CLASSES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedClass(c)}
                    className={`px-4 py-2 rounded text-sm transition-all ${
                      selectedClass.code === c.code
                        ? "bg-[#1a2843] text-[#38bdf8]"
                        : "border border-white/8 text-[#8ba3c7] hover:text-[#f0f4ff]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                {[
                  {
                    label: "Enrolled Students",
                    value: selectedClass.students,
                    color: "#38bdf8",
                  },
                  {
                    label: "Avg Attendance",
                    value: `${selectedClass.avgAttendance}%`,
                    color:
                      selectedClass.avgAttendance >= 75 ? "#4ade80" : "#f87171",
                  },
                  {
                    label: "Avg Score",
                    value: `${selectedClass.avgScore}/100`,
                    color: "#f5a623",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-[#131e33] border border-white/8 rounded-xl p-5"
                  >
                    <div className="text-xs text-[#4d6b8a] mb-2">{s.label}</div>
                    <div
                      className="text-3xl font-semibold"
                      style={{ fontFamily: "Fraunces, serif", color: s.color }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#131e33] border border-white/8 rounded-xl p-6">
                <h2
                  className="font-semibold mb-4"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Syllabus Coverage — {selectedClass.name}
                </h2>
                <div className="space-y-4">
                  {[
                    { unit: "Unit 1 — Introduction & Arrays", pct: 100 },
                    { unit: "Unit 2 — Linked Lists & Stacks", pct: 100 },
                    {
                      unit: "Unit 3 — Trees & Heaps",
                      pct: selectedClass.coverage,
                    },
                    {
                      unit: "Unit 4 — Graphs",
                      pct: Math.max(selectedClass.coverage - 30, 10),
                    },
                    {
                      unit: "Unit 5 — Dynamic Programming",
                      pct: Math.max(selectedClass.coverage - 60, 0),
                    },
                  ].map((u) => (
                    <div key={u.unit}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#8ba3c7]">{u.unit}</span>
                        <span
                          className={
                            u.pct === 100 ? "text-green-400" : "text-[#f5a623]"
                          }
                        >
                          {u.pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#0b1120] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${u.pct}%`,
                            background: u.pct === 100 ? "#4ade80" : "#38bdf8",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
                AI Teaching Assistant
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
                          ? "bg-[#38bdf8]/20 text-[#38bdf8]"
                          : "bg-[#1a2843] text-[#38bdf8]"
                      }`}
                    >
                      {m.role === "user" ? "Dr" : "✦"}
                    </div>
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                        m.role === "user"
                          ? "bg-[#38bdf8]/15 text-[#f0f4ff]"
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
                    "Generate quiz on AVL Trees",
                    "Class performance CS301",
                    "Attendance risk list",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs border border-white/10 text-[#8ba3c7] px-3 py-1.5 rounded-full hover:border-[#38bdf8]/40 hover:text-[#38bdf8] transition-all"
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
                    placeholder="Generate quiz, analyze performance, check coverage…"
                    className="flex-1 bg-[#131e33] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4d6b8a] focus:outline-none focus:border-[#38bdf8]/50 transition-colors"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={aiTyping}
                    className="bg-[#38bdf8] text-[#0b1120] font-semibold px-4 py-3 rounded-lg hover:bg-[#7dd3fc] transition-colors disabled:opacity-50 text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCHEDULE */}
          {tab === "schedule" && (
            <div className="space-y-6 max-w-2xl">
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Today's Schedule
              </h1>
              <div className="relative">
                <div className="absolute left-[4.5rem] top-0 bottom-0 w-px bg-white/8" />
                <div className="space-y-6">
                  {SCHEDULE.map((s) => (
                    <div key={s.time} className="flex gap-6 items-start">
                      <div className="text-xs font-mono text-[#4d6b8a] w-16 flex-shrink-0 pt-1">
                        {s.time}
                      </div>
                      <div
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0 z-10"
                        style={{
                          background:
                            s.type === "lecture"
                              ? "#38bdf8"
                              : s.type === "lab"
                                ? "#a78bfa"
                                : "#4d6b8a",
                        }}
                      />
                      <div className="bg-[#131e33] border border-white/8 rounded-xl p-5 flex-1 hover:border-white/15 transition-colors">
                        <div
                          className="font-semibold mb-1"
                          style={{ fontFamily: "Fraunces, serif" }}
                        >
                          {s.subject}
                        </div>
                        <div className="text-sm text-[#8ba3c7]">
                          {s.batch} · {s.room}
                        </div>
                        <span
                          className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded font-mono"
                          style={{
                            background:
                              s.type === "lecture"
                                ? "#38bdf8" + "20"
                                : s.type === "lab"
                                  ? "#a78bfa20"
                                  : "#4d6b8a20",
                            color:
                              s.type === "lecture"
                                ? "#38bdf8"
                                : s.type === "lab"
                                  ? "#a78bfa"
                                  : "#8ba3c7",
                          }}
                        >
                          {s.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBMISSIONS */}
          {tab === "submissions" && (
            <div className="space-y-6">
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Recent Submissions
              </h1>
              <div className="bg-[#131e33] border border-white/8 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase">
                        Student
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase hidden md:table-cell">
                        Assignment
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase">
                        Score
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-mono tracking-widest text-[#4d6b8a] uppercase hidden sm:table-cell">
                        Submitted
                      </th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_SUBMISSIONS.map((s) => (
                      <tr
                        key={s.roll}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium">{s.student}</div>
                          <div className="text-xs text-[#4d6b8a] font-mono">
                            {s.roll}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#8ba3c7] hidden md:table-cell">
                          {s.assignment}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="font-semibold"
                            style={{
                              color:
                                s.score >= 90
                                  ? "#4ade80"
                                  : s.score >= 75
                                    ? "#f5a623"
                                    : "#f87171",
                            }}
                          >
                            {s.score}
                          </span>
                          <span className="text-[#4d6b8a]">/100</span>
                        </td>
                        <td className="px-6 py-4 text-[#4d6b8a] text-xs font-mono hidden sm:table-cell">
                          {s.time}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedSubmission(s)}
                            className="text-xs text-[#38bdf8] hover:text-[#7dd3fc] transition-colors"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      {selectedSubmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Review ${selectedSubmission.student}`}
        >
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#131e33] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-[#4d6b8a]">
                  {selectedSubmission.roll}
                </p>
                <h2
                  className="mt-1 text-xl font-semibold"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  {selectedSubmission.student}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="text-sm text-[#8ba3c7] hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-[#0b1120] p-4">
                <p className="text-xs text-[#4d6b8a]">Assignment</p>
                <p className="mt-1 text-sm text-[#c8d8ef]">
                  {selectedSubmission.assignment}
                </p>
              </div>
              <div className="rounded-lg bg-[#0b1120] p-4">
                <p className="text-xs text-[#4d6b8a]">Score</p>
                <p className="mt-1 text-2xl font-semibold text-[#38bdf8]">
                  {selectedSubmission.score}/100
                </p>
              </div>
            </div>
            <label className="mt-5 block text-xs text-[#8ba3c7]">
              Feedback
              <textarea
                defaultValue="Good work. Review the marked concepts before the next assessment."
                rows={4}
                className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-[#0b1120] px-3 py-2 text-sm text-white outline-none focus:border-[#38bdf8]/50"
              />
            </label>
            <button
              type="button"
              onClick={() => setSelectedSubmission(null)}
              className="mt-5 w-full rounded-lg bg-[#38bdf8] px-4 py-2.5 text-sm font-semibold text-[#0b1120] hover:bg-[#7dd3fc]"
            >
              Save feedback
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

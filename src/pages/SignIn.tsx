import { useState } from "react"
import { useNav, Role } from "../App"

const DEMO_ACCOUNTS: {
  email: string
  password: string
  name: string
  role: Role
  label: string
  color: string
}[] = [
  {
    email: "student@university.edu",
    password: "demo123",
    name: "Arjun Sharma",
    role: "student",
    label: "Student",
    color: "#f5a623",
  },
  {
    email: "professor@university.edu",
    password: "demo123",
    name: "Dr. Priya Mehta",
    role: "professor",
    label: "Professor",
    color: "#38bdf8",
  },
  {
    email: "admin@university.edu",
    password: "demo123",
    name: "Rajesh Kumar",
    role: "admin",
    label: "Admin",
    color: "#a78bfa",
  },
]

export default function SignIn() {
  const { navigate, login } = useNav()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setTimeout(() => {
      const match = DEMO_ACCOUNTS.find(
        (a) => a.email === email && a.password === password,
      )
      if (match) {
        login(match.name, match.email, match.role)
      } else {
        setError("Invalid email or password. Try a demo account below.")
        setLoading(false)
      }
    }, 800)
  }

  const handleDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email)
    setPassword(account.password)
    setError("")
    setLoading(true)
    setTimeout(() => {
      login(account.name, account.email, account.role)
    }, 600)
  }

  return (
    <div className="min-h-full bg-[#0b1120] text-[#f0f4ff] flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <button
          onClick={() => navigate("landing")}
          className="flex items-center gap-3"
        >
          <span
            className="w-8 h-8 rounded bg-[#f5a623] flex items-center justify-center text-[#0b1120] font-bold text-sm"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Ac
          </span>
          <span
            className="font-semibold text-lg"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            AcademiQ
          </span>
        </button>
        <button
          onClick={() => navigate("landing")}
          className="text-sm text-[#8ba3c7] hover:text-[#f0f4ff] transition-colors flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Back to home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1
              className="text-3xl font-semibold mb-2"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Sign in to AcademiQ
            </h1>
            <p className="text-[#8ba3c7] text-sm">
              Access your role-specific academic dashboard
            </p>
          </div>

          {/* Demo quick-login */}
          <div className="mb-8">
            <p className="text-xs font-mono tracking-widest text-[#4d6b8a] uppercase mb-3">
              Quick demo login
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => handleDemo(acc)}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 py-3 px-2 rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                  style={{
                    borderColor: acc.color + "40",
                    background: acc.color + "0a",
                  }}
                >
                  <span className="text-lg">
                    {acc.role === "student"
                      ? "🎓"
                      : acc.role === "professor"
                        ? "📖"
                        : "⚙️"}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: acc.color }}
                  >
                    {acc.label}
                  </span>
                  <span className="text-[9px] text-[#4d6b8a] font-mono">
                    {acc.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-[#4d6b8a]">or sign in manually</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#8ba3c7] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@university.edu"
                className="w-full bg-[#131e33] border border-white/10 rounded px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4d6b8a] focus:outline-none focus:border-[#f5a623]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8ba3c7] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#131e33] border border-white/10 rounded px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4d6b8a] focus:outline-none focus:border-[#f5a623]/50 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f5a623] text-[#0b1120] font-semibold py-3 rounded hover:bg-[#fbbf55] transition-colors text-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeOpacity="0.3"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 bg-[#131e33] border border-white/8 rounded-xl p-5">
            <p className="text-xs font-mono tracking-widest text-[#4d6b8a] uppercase mb-3">
              Demo credentials
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <div key={acc.role} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-mono" style={{ color: acc.color }}>
                    {acc.label}
                  </span>
                  <span className="text-[#8ba3c7] font-mono flex-1">
                    {acc.email}
                  </span>
                  <span className="text-[#4d6b8a] font-mono">demo123</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

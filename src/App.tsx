import { useState, createContext, useContext } from "react"
import Landing from "./pages/Landing"
import SignIn from "./pages/SignIn"
import StudentDashboard from "./pages/StudentDashboard"
import ProfessorDashboard from "./pages/ProfessorDashboard"
import AdminDashboard from "./pages/AdminDashboard"

export type Page = "landing" | "signin" | "student" | "professor" | "admin"
export type Role = "student" | "professor" | "admin" | null

interface NavCtx {
  navigate: (p: Page) => void
  currentUser: { name: string; email: string; role: Role } | null
  login: (name: string, email: string, role: Role) => void
  logout: () => void
}

export const NavContext = createContext<NavCtx>({
  navigate: () => {},
  currentUser: null,
  login: () => {},
  logout: () => {},
})

export function useNav() {
  return useContext(NavContext)
}

export default function App() {
  const [page, setPage] = useState<Page>("landing")
  const [currentUser, setCurrentUser] = useState<NavCtx["currentUser"]>(null)

  const login = (name: string, email: string, role: Role) => {
    setCurrentUser({ name, email, role })
    if (role === "student") setPage("student")
    else if (role === "professor") setPage("professor")
    else setPage("admin")
  }

  const logout = () => {
    setCurrentUser(null)
    setPage("landing")
  }

  return (
    <NavContext.Provider
      value={{ navigate: setPage, currentUser, login, logout }}
    >
      {page === "landing" && <Landing />}
      {page === "signin" && <SignIn />}
      {page === "student" && <StudentDashboard />}
      {page === "professor" && <ProfessorDashboard />}
      {page === "admin" && <AdminDashboard />}
    </NavContext.Provider>
  )
}

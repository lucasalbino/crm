import { useLocation } from 'react-router-dom'
import { Moon, Sun, Bell } from 'lucide-react'
import { useStore } from '../../store'

const titles = {
  '/': 'Dashboard',
  '/pipeline': 'Pipeline',
  '/companies': 'Empresas',
  '/contacts': 'Contatos',
  '/tasks': 'Tarefas',
}

export default function Header() {
  const location = useLocation()
  const { darkMode, toggleDarkMode, tasks } = useStore()
  const title = titles[location.pathname] || 'CRM'
  const pendingToday = tasks.filter((t) => {
    if (t.status === 'done') return false
    const today = new Date().toISOString().split('T')[0]
    return t.dueDate === today
  }).length

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-6
                       bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-md
                       border-b border-border dark:border-border-dark">
      <h1 className="text-base font-semibold text-[#0F172A] dark:text-white">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell size={17} />
          {pendingToday > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  )
}

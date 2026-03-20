import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  Kanban,
  CheckSquare,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/companies', icon: Building2, label: 'Empresas' },
  { to: '/contacts', icon: Users, label: 'Contatos' },
  { to: '/tasks', icon: CheckSquare, label: 'Tarefas' },
]

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-sidebar flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center shadow-sm">
          <TrendingUp size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">CRM</p>
          <p className="text-slate-500 text-[10px] mt-0.5">Gestão de Relacionamento</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Usuário</p>
            <p className="text-slate-500 text-[10px] truncate">admin@crm.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

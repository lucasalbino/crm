import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, TrendingUp, CheckSquare, DollarSign,
  ArrowRight, Phone, Mail, Calendar, Plus,
} from 'lucide-react'
import { useStore } from '../store'
import { STAGES } from '../utils/constants'
import { formatCurrency, formatRelativeDate, isOverdue, isToday } from '../utils/formatters'
import { StageBadge, TaskTypeBadge } from '../components/ui/Badge'
import TaskModal from '../components/tasks/TaskModal'

function StatCard({ icon: Icon, label, value, sub, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-primary dark:bg-blue-900/20',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
  }
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-[#0F172A] dark:text-white">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

function ForecastBar({ stage, value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const s = STAGES.find((x) => x.id === stage)
  if (!s) return null

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs text-slate-500 dark:text-slate-400 truncate shrink-0">{s.label}</div>
      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#2563EB,#3B82F6)' }}
        />
      </div>
      <div className="w-24 text-xs font-semibold text-[#0F172A] dark:text-slate-200 text-right shrink-0">
        {formatCurrency(value)}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { companies, tasks, contacts } = useStore()
  const navigate = useNavigate()
  const [taskModalOpen, setTaskModalOpen] = useState(false)

  const activeCompanies = companies.filter((c) => c.status === 'ativo')
  const totalPipeline = activeCompanies.reduce((s, c) => s + (c.value || 0), 0)

  // Forecast: weighted sum
  const forecast = activeCompanies.reduce((s, c) => {
    const stage = STAGES.find((x) => x.id === c.stage)
    return s + (c.value || 0) * (stage?.probability ?? 0)
  }, 0)

  // By stage
  const byStage = STAGES.map((s) => ({
    ...s,
    companies: activeCompanies.filter((c) => c.stage === s.id),
    total: activeCompanies
      .filter((c) => c.stage === s.id)
      .reduce((sum, c) => sum + (c.value || 0), 0),
  }))

  const pendingTasks = tasks.filter((t) => t.status === 'pending')
  const todayTasks = pendingTasks.filter((t) => isToday(t.dueDate))
  const overdueTasks = pendingTasks.filter((t) => isOverdue(t.dueDate))

  const taskIcon = { call: Phone, email: Mail, meeting: Calendar }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Empresas ativas"
          value={activeCompanies.length}
          sub={`${companies.length} total`}
          color="blue"
        />
        <StatCard
          icon={DollarSign}
          label="Total pipeline"
          value={formatCurrency(totalPipeline)}
          sub={`${activeCompanies.length} oportunidades`}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Forecast"
          value={formatCurrency(forecast)}
          sub="Ponderado por etapa"
          color="purple"
        />
        <StatCard
          icon={CheckSquare}
          label="Tarefas hoje"
          value={todayTasks.length}
          sub={overdueTasks.length > 0 ? `${overdueTasks.length} em atraso` : 'Em dia'}
          color={overdueTasks.length > 0 ? 'amber' : 'green'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Forecast */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">Forecast por Etapa</h2>
              <p className="text-xs text-slate-400 mt-0.5">Valor em cada etapa do pipeline</p>
            </div>
            <button
              onClick={() => navigate('/pipeline')}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Ver pipeline <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {byStage.map((s) => (
              <ForecastBar key={s.id} stage={s.id} value={s.total} total={totalPipeline} />
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-border dark:border-border-dark flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Forecast total</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(forecast)}</span>
          </div>
        </div>

        {/* Today's tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">Tarefas do dia</h2>
            <button
              onClick={() => setTaskModalOpen(true)}
              className="p-1 rounded-lg text-primary hover:bg-primary-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {todayTasks.length === 0 && overdueTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare size={32} className="text-slate-200 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Nenhuma tarefa para hoje</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...overdueTasks.slice(0, 2), ...todayTasks.slice(0, 4)].map((task) => {
                const company = companies.find((c) => c.id === task.companyId)
                const Icon = taskIcon[task.type] || CheckSquare
                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className={`p-1.5 rounded-lg mt-0.5 ${
                      isOverdue(task.dueDate)
                        ? 'bg-red-100 text-red-500'
                        : 'bg-blue-50 text-primary'
                    }`}>
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#0F172A] dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {company?.name ?? 'Sem empresa'} · {formatRelativeDate(task.dueDate)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {(todayTasks.length + overdueTasks.length) > 6 && (
            <button
              onClick={() => navigate('/tasks')}
              className="w-full mt-3 text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1"
            >
              Ver todas <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Stage summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {byStage.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate('/pipeline')}
            className="card card-hover p-4 text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${s.dotClass}`} />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{s.label}</span>
            </div>
            <p className="text-base font-bold text-[#0F172A] dark:text-white">{s.companies.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">{formatCurrency(s.total)}</p>
          </button>
        ))}
      </div>

      <TaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
    </div>
  )
}

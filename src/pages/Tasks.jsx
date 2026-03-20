import { useState, useMemo } from 'react'
import { Plus, Search, CheckSquare, Check, Pencil, Trash2, Phone, Mail, Calendar, AlertCircle } from 'lucide-react'
import { useStore } from '../store'
import { formatRelativeDate, isOverdue, isToday } from '../utils/formatters'
import { TaskTypeBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import TaskModal from '../components/tasks/TaskModal'
import Modal from '../components/ui/Modal'

const typeIcon = { call: Phone, email: Mail, meeting: Calendar }

function TaskRow({ task, onEdit, onDelete }) {
  const { toggleTask, companies } = useStore()
  const company = companies.find((c) => c.id === task.companyId)
  const Icon = typeIcon[task.type] || CheckSquare
  const overdue = isOverdue(task.dueDate) && task.status !== 'done'
  const today = isToday(task.dueDate)
  const done = task.status === 'done'

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border-b border-border dark:border-border-dark
                  last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors
                  ${done ? 'opacity-50' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleTask(task.id)}
        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200
          ${done
            ? 'bg-green-500 border-green-500 text-white'
            : overdue
              ? 'border-red-300 hover:border-red-400'
              : 'border-slate-300 hover:border-primary'
          }`}
      >
        {done && <Check size={11} strokeWidth={3} />}
      </button>

      {/* Icon */}
      <div className={`p-1.5 rounded-lg shrink-0 ${
        overdue && !done ? 'bg-red-100 text-red-500 dark:bg-red-900/30' :
        today ? 'bg-blue-50 text-primary dark:bg-blue-900/30' :
        'bg-slate-100 text-slate-400 dark:bg-slate-800'
      }`}>
        <Icon size={13} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${
          done ? 'line-through text-slate-400' : 'text-[#0F172A] dark:text-white'
        }`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {company && (
            <span className="text-[11px] text-slate-400 truncate">{company.name}</span>
          )}
          {company && <span className="text-slate-300 dark:text-slate-600">·</span>}
          <span className={`text-[11px] font-medium ${
            overdue && !done ? 'text-red-500' : today && !done ? 'text-primary' : 'text-slate-400'
          }`}>
            {overdue && !done && <span className="inline-flex items-center gap-0.5"><AlertCircle size={10} /> </span>}
            {formatRelativeDate(task.dueDate)}
          </span>
        </div>
      </div>

      {/* Badge + Actions */}
      <TaskTypeBadge type={task.type} />

      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary/10 transition-colors"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Tasks() {
  const { tasks, deleteTask, companies } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | pending | done | today | overdue
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tasks
      .filter((t) => {
        if (q) {
          const company = companies.find((c) => c.id === t.companyId)
          if (
            !t.title.toLowerCase().includes(q) &&
            !company?.name.toLowerCase().includes(q)
          ) return false
        }
        if (filter === 'pending') return t.status === 'pending'
        if (filter === 'done') return t.status === 'done'
        if (filter === 'today') return isToday(t.dueDate) && t.status !== 'done'
        if (filter === 'overdue') return isOverdue(t.dueDate) && t.status !== 'done'
        return true
      })
      .sort((a, b) => {
        if (a.status === 'done' && b.status !== 'done') return 1
        if (a.status !== 'done' && b.status === 'done') return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      })
  }, [tasks, search, filter, companies])

  const counts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    done: tasks.filter((t) => t.status === 'done').length,
    today: tasks.filter((t) => isToday(t.dueDate) && t.status !== 'done').length,
    overdue: tasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'done').length,
  }), [tasks])

  const handleEdit = (t) => { setEditTask(t); setModalOpen(true) }
  const handleNew = () => { setEditTask(null); setModalOpen(true) }
  const confirmDelete = () => { deleteTask(deleteConfirm.id); setDeleteConfirm(null) }

  const filterTabs = [
    { id: 'all', label: 'Todas' },
    { id: 'today', label: 'Hoje' },
    { id: 'overdue', label: 'Atrasadas' },
    { id: 'pending', label: 'Pendentes' },
    { id: 'done', label: 'Concluídas' },
  ]

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-base pl-9"
            placeholder="Buscar tarefas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleNew}>
          <Plus size={15} /> Nova tarefa
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
              ${filter === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 bg-white dark:bg-[#161B22] border border-border dark:border-border-dark'
              }`}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${filter === tab.id
                  ? 'bg-white/20 text-white'
                  : tab.id === 'overdue'
                    ? 'bg-red-100 text-red-500 dark:bg-red-900/30'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <CheckSquare size={40} className="text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Nenhuma tarefa encontrada</p>
            <button onClick={handleNew} className="mt-2 text-xs text-primary hover:underline font-semibold">
              Criar nova tarefa
            </button>
          </div>
        ) : (
          filtered.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onEdit={handleEdit}
              onDelete={setDeleteConfirm}
            />
          ))
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editTask}
      />

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Excluir tarefa" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          Tem certeza que deseja excluir a tarefa <strong>"{deleteConfirm?.title}"</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
        </div>
      </Modal>
    </div>
  )
}
